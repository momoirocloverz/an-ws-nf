/* eslint-disable no-unused-vars */
import React, {
  useCallback,
  useEffect, useMemo, useReducer, useRef, useState
} from "react";
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import {
  getCategoryList,
  getLandById, getLandData,
  getLayerAccessToken,
  queryCoordinate
} from "@/services/agricultureSubsidies";
import _ from "lodash";
import {
  Button, message, Select, DatePicker, Cascader, Spin
} from "antd";
// import 'mapbox-gl/dist/mapbox-gl.css';
import moment, { Moment } from "moment";
import { ownershipTypes, seasons, USER_TYPES } from "@/pages/agricultureSubsidies/consts";
import {
  transformCategoryTree, getCurrentSeason, findAuthorizationsByPath, findRegionNames, findPolygonType, traverseTree
} from "@/pages/agricultureSubsidies/utils";
import { CascaderOptionType } from "antd/es/cascader";
import { connect } from "umi";
import { ConnectState } from "@/models/connect";
import { LoadingOutlined } from "@ant-design/icons";
import "@/utils/third_party/L.LabelTextCollision";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./LandSelector.less";
//
// mapboxgl.workerClass = MapboxWorker;
// mapboxgl.accessToken = 'pk.eyJ1IjoibWV6enkiLCJhIjoiY2tqcnczMjl3M3UzcDJ6bG9md3gyYWtreSJ9.uVCzcLF4XYCB_R4U19SnBw';

function selectedReducer(state: object[], action) {
  switch (action.type) {
    case "add": {
      const newState: object[] = [...state];
      newState.push(action.item);
      return newState;
    }
    case "remove": {
      const newState = [...state];
      // @ts-ignore
      const idx = newState.map((e) => e.id).indexOf(action.id);
      if (idx < 0) {
        return state;
      }
      newState.splice(idx, 1);
      return newState;
    }
    case "toggle": {
      // @ts-ignore
      const idx = state.map((e) => e.id).indexOf(action.item.id);
      if (idx < 0) {
        return selectedReducer(state, { type: "add", item: action.item });
      }
      return selectedReducer(state, { type: "remove", id: action.item.id });
    }
    case "clear": {
      return [];
    }
    case "set": {
      return [...action.state];
    }
    default:
      return state;
  }
}

const highlightColor = "rgb(255,249,190)";
const labelHaloColor = "rgba(0,0,0,0.7)";
const unclaimedOutlineColor = "#52c41a";
const claimedOutlineColor = "#f5222d";
const postedOutlineColor = "rgb(255,132,0)";
const pendingOutlineColor = "rgb(255,228,0)";
const claimedFillColor = "rgba(255,50,50,0.5)";
const unclaimedFillColor = "rgba(82,196,26,0.5)";
const selectedFillColor = "rgba(0,72,255,0.5)";
const postedFillColor = "rgb(255,132,0,0.5)";
const pendingFillColor = "rgba(255,228,0,0.5)";
const fallbackColor = "#bc1fff";


function MiniFarmlandMap({
                           user, regions, authorizations, visible, context, onSelectedChange
                         }) {
  // map states
  const mapContainer = useRef(null);
  const mapRef = useRef();
  const [lng, setLng] = useState(121.13);
  const [lat, setLat] = useState(30.70);
  const [zoom, setZoom] = useState(10);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [selected, dispatch] = useReducer(selectedReducer, context.selected);
  // filter states
  const [region, setRegion] = useState(context.region);
  const [year, setYear] = useState<Moment | null>('');
  const [season, setSeason] = useState(context.season);
  // modal states
  const sourceDataRef = useRef(new Map());
  const isVillageOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, "/agriculture-subsidies/farmland-map").indexOf(USER_TYPES.VILLAGE_OFFICIAL) > -1), [user, authorizations]);
  const [originalSelected] = useState(context.selected);
  const [loadedData, setLoadedData] = useState([undefined, undefined]);
  const mapLayersRef = useRef(new Map());

  const loadGeometryData = async () => {
    setIsDataLoading(true);
    try {
      const result = await getLandData({
        regionNames: findRegionNames(regions, region),
        regionIds: region,
        year,
        categoryRootName: traverseTree(context.categoryTree, context.category, "value", "label")[0],
        season: seasons[season]
      });
      const parsedData = result.data.data;
      if (parsedData.length === 0) {
        message.info("查询到0条数据");
      }
      const calculatedLabelPoints = { type: "FeatureCollection", features: [] };
      const polygons = { type: "FeatureCollection", features: [] };
      const sourceDataMap = new Map();
      parsedData.forEach((e) => {
        const { geom, other_geom_list, ...itemProps } = e;
        sourceDataMap.set(e.id.toString(), e);
        const parsedGeometry = JSON.parse(other_geom_list ?? "[]");
        const shape = findPolygonType(parsedGeometry);
        const point = { type: "Feature", properties: e, geometry: { type: "Point", coordinates: [] } };
        const poly = { type: "Feature", properties: e, geometry: { type: shape, coordinates: parsedGeometry } };
        const coords: [number, number][] = shape === "MultiPolygon" ? _.flattenDepth(parsedGeometry, 2) : _.flatten(parsedGeometry);
        // const coords: [number, number][] = flatten(parsedGeometry)
        if (coords.filter((p) => !(Array.isArray(p) && p.length === 2)).length < 1) {
          // @ts-ignore
          point.geometry.coordinates = coords.reduce((c, v) => [c[0] + v[0], c[1] + v[1]]).map((p) => p / coords.length);
          // @ts-ignore
          calculatedLabelPoints.features.push(point);
          // @ts-ignore
          polygons.features.push(poly);
        } else {
          console.error(`坐标数据错误:${JSON.stringify(e, null, "\t")}`);
        }
      });
      sourceDataRef.current = sourceDataMap;
      // mapRef.current?.getSource('label-anchors')?.setData(calculatedLabelPoints);
      // mapRef.current?.getSource('farmlands-source')?.setData(polygons);
      if (calculatedLabelPoints.features.length > 0) {
        // mapRef.current.flyTo({
        //   center: calculatedLabelPoints.features[0].geometry.coordinates,
        //   zoom: 15.52,
        //   duration: 5000,
        // });
      }
      setLoadedData([polygons, calculatedLabelPoints]);
    } catch (e) {
      // console.error(e)
    } finally {
      setIsDataLoading(false);
    }
  };
  useEffect(() => {
    if (!isMapLoading && !isDataLoading && loadedData.indexOf(undefined) < 0) {
      // mapRef.current?.getSource('label-anchors')?.setData(loadedData[1]);
      // mapRef.current?.getSource('farmlands-source')?.setData(loadedData[0]);
      if (loadedData[1].features.length > 0) {
        const flattenedCoordinate = _.flattenDeep(JSON.parse(context.selected[0].other_geom_list));
        mapRef.current.flyTo(
          context.selected.length > 0 ? [flattenedCoordinate[1], flattenedCoordinate[0]] : loadedData[1].features[0].geometry.coordinates,
          15.52,
          {
            duration: 2
          }
        );
      }
      dispatch({ type: "set", state: context.selected });
    }
  }, [isDataLoading, isMapLoading, loadedData]);

  const initiateMap = async () => {
    // const map = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: 'mapbox://styles/mezzy/ckkyqdi1n0hp617s80lxbim7u',
    //   center: [lng, lat],
    //   minZoom: 8,
    //   maxBounds: [[119, 28], [123, 32]],
    //   zoom,
    // });
    const customRenderer = new L.LabelTextCollision({
      collisionFlg: true
    });
    const tianDiTuKey = "b0abd06f43298846b3ddc93b5bf3779d";
    const baseLayer = L.tileLayer(`https://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=${tianDiTuKey}`, {
      maxZoom: 18,
      id: "satellite-map",
      subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
      attribution: ""
    });
    const map = new L.Map(mapContainer.current, {
      layers: [baseLayer],
      minZoom: 10,
      maxZoom: 18,
      maxBounds: [[28, 119], [32, 123]],
      zoomSnap: 0.01,
      zoomDelta: 0.1,
      zoomControl: false,
      renderer: customRenderer
    });
    map.on("load", async () => {
      setIsMapLoading(false);
    });
    map.setView([lat, lng], zoom);
    mapRef.current = map;
  };

  useEffect(() => {
    // loadGeometryData(); // 2022-03-07 注释 改用 下面的逻辑
    return () => {
      // @ts-ignore
      // eslint-disable-next-line no-unused-expressions
      mapRef.current?.remove();
    };
  }, []);
  useEffect(() => {
    year && loadGeometryData();
  }, [year,context.year]);
  useEffect(() => {
    if (user && authorizations?.length > 0 && regions.length > 0 && !mapRef.current ) {
      initiateMap();
    }
  }, [user, authorizations, regions]);

  const selectedAsGeoJSON = useMemo(() => {
    const updatedGeoJSON = {
      type: "FeatureCollection",
      features: []
    };
    selected.forEach((item) => {
      const { geom, other_geom_list, ...itemProps } = item;
      const coords = JSON.parse(other_geom_list ?? "[]");
      const feature = {
        type: "Feature",
        properties: itemProps,
        geometry: {
          type: findPolygonType(coords),
          coordinates: coords
          // [
          // geom.substring(9, geom.length - 2).split(',').map((p) => p.split(' ').map((c) => parseFloat(c))),
          // ...(otherGeomList.map((el) => {
          //   const arr = el.substring(9, geom.length - 2).split(',').map((p) => p.split(' ').map((c) => parseFloat(c)));
          //   if (_.last(arr).length!==2){
          //     console.log("%cproblem found!", 'color:red')
          //     arr[arr.length-1] = arr[0];
          //   }
          //   return arr
          // })),
          // ],
        }
      };
      // @ts-ignore
      updatedGeoJSON.features.push(feature);
    });
    return updatedGeoJSON;
  }, [selected]);
  useEffect(() => {
    if (mapRef.current && !isMapLoading) {
      // @ts-ignore
      // mapRef.current?.getSource('selected-lands')?.setData(selectedAsGeoJSON);
      const newSelectedLandsLayer = L.geoJSON(selectedAsGeoJSON, {
        style: (feature) => ({
          color: selectedFillColor,
          fillOpacity: 1
        }),
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(
            `地区: ${feature.properties.town_name}-${feature.properties.village_name}`
            + `\n编号: ${feature.properties.land_num}`
            + `\n面积: ${feature.properties.land_areamu}亩`
            + `\n承包个体: ${feature.properties.contract_b}`,
            {
              direction: "center",
              className: styles.farmTooltip
            }
          );
        }
      }).addTo(mapRef.current);

      newSelectedLandsLayer.on("click", async (e) => {
        // const landData = await getLandById(e.features[0].properties.land_id);
        if (isVillageOfficial && (e.sourceTarget.feature.properties.declare_id === 0 || e.sourceTarget.feature.properties.declare_id === context.claimId)) {
          dispatch({
            type: "toggle",
            item: { ...(e.sourceTarget.feature.properties), id: e.sourceTarget.feature.properties.id }
          });
        }
      });
      mapLayersRef.current.set("selected-lands", newSelectedLandsLayer);
      onSelectedChange(selected);
    }
    return () => {
      if (mapRef.current) {
        const prev = mapLayersRef.current.get("selected-lands");
        prev?.off();
        prev?.remove();
      }
    };
  }, [selected]);

  const farmlandsPolygonStyle = function(feature) {
    const claimed = !!feature.properties.declare_id;
    const pending = claimed && (!feature.properties.publicity_start || feature.properties.publicity_start.startsWith("0000") || feature.properties.is_adopt === 3);
    const posted = claimed && feature.properties.publicity_start && (new Date() < new Date(feature.properties.publicity_end));
    let outlineColor = fallbackColor;
    let fillColor = fallbackColor;
    if (claimed) {
      outlineColor = claimedOutlineColor;
      fillColor = claimedFillColor;
      pending && (outlineColor = pendingOutlineColor);
      pending && (fillColor = pendingFillColor);
      posted && (outlineColor = postedOutlineColor);
      posted && (fillColor = postedFillColor);
    } else {
      outlineColor = unclaimedOutlineColor;
      fillColor = unclaimedFillColor;
    }
    return {
      color: outlineColor,
      fillColor,
      fillOpacity: 1,
      weight: 2
    };
  };
  useEffect(() => {
    if (!isMapLoading && loadedData) {
      const farmlands = L.geoJSON(loadedData?.[0], {
        style: farmlandsPolygonStyle,
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(
            `地区: ${feature.properties.town_name}-${feature.properties.village_name}`
            + `\n编号: ${feature.properties.land_num}`
            + `\n面积: ${feature.properties.land_areamu}亩`
            + `\n承包个体: ${feature.properties.contract_b}`,
            {
              direction: "center",
              className: styles.farmTooltip
            }
          );
        }
      }).addTo(mapRef.current);
      mapLayersRef.current.set("farmlands", farmlands);
      farmlands.on("click", async (e) => {
        console.log(e.sourceTarget.feature.properties)
        // const landData = await getLandById(e.features[0].properties.land_id);
        if (isVillageOfficial && (e.sourceTarget.feature.properties.declare_id === 0 || e.sourceTarget.feature.properties.declare_id === context.claimId)) {
          dispatch({
            type: "toggle",
            item: { ...(e.sourceTarget.feature.properties), id: e.sourceTarget.feature.properties.id }
          });
        }
      });
      // TODO: cursor change
      // farmlands.on('mouseover', (e) => {
      //   mapContainer.current.style.cursor = 'not-allowed';
      // });
      // farmlands.on('mouseout', (e) => {
      //   mapContainer.current.style.cursor = 'grab';
      // });
      const labelLayer = L.geoJSON(loadedData?.[1], {
        pointToLayer(feature, latlng) {
          return L.circleMarker(latlng);
        },
        interactive: false,
        style: (feature) => ({
          stroke: false,
          fillColor: "transparent",
          text: feature.properties.declare_id ? `${feature.properties.real_name}-${feature.properties.land_areamu}亩` : `${feature.properties.village_name}-${_.last(feature.properties.land_id.split("-"))}-${feature.properties.contract_b}`
          // text: `${feature.properties.land_num}\n${feature.properties.contract_num}`,
        })
      }).addTo(mapRef.current);
      mapLayersRef.current.set("labels", labelLayer);
      // mapRef.current?.getSource('label-anchors')?.setData(mapData?.[1]);
      // mapRef.current?.getSource('farmlands-source')?.setData(mapData?.[0]);
    }
    return () => {
      if (!isMapLoading && loadedData) {
        const prev = mapLayersRef.current.get("farmlands");
        prev?.off();
        prev?.remove();
        mapLayersRef.current.get("labels")?.remove();
      }
    };
  }, [isMapLoading, loadedData]);
  useEffect(() => {
    setRegion(context.region);
    setYear(context.year);
    setSeason(context.season);
  }, [context.year]);
  return (
    <Spin indicator={<LoadingOutlined />} spinning={isMapLoading || isDataLoading} tip="准备地图中">
      <div className={styles.container} ref={mapContainer} />
    </Spin>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regions: info.areaList
}))(MiniFarmlandMap);
