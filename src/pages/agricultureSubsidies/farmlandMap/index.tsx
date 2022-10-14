/* eslint-disable no-unused-vars, camelcase */
import React, {
  MutableRefObject,
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
  getLandData,
  getVillageAdoptOtherInfo
} from "@/services/agricultureSubsidies";
import _ from "lodash";
import {
  Button, message, Select, DatePicker, Cascader, Spin, Modal
} from "antd";
// import 'mapbox-gl/dist/mapbox-gl.css';
import moment, { Moment } from "moment";
import { ownershipTypes, seasons, USER_TYPES } from "@/pages/agricultureSubsidies/consts";
import {
  transformCategoryTree,
  getCurrentSeason,
  findAuthorizationsByPath,
  findRegionNames,
  traverseTree,
  geoJSONNullCheck,
   findPolygonType, validateCascaderValue
} from "@/pages/agricultureSubsidies/utils";
// @ts-ignore
import { CascaderOptionType } from "antd/es/cascader";
import { connect } from "umi";
import { ConnectState } from "@/models/connect";
// import LandClaimFilingForm from '@/components/agricultureSubsidies/LandClaimFilingForm';
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import LandClaimFilingModal from "@/components/agricultureSubsidies/LandClaimFilingModal";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/utils/third_party/L.LabelTextCollision";
import styles from "./index.less";

// mapboxgl.workerClass = MapboxWorker;
// mapboxgl.accessToken = 'pk.eyJ1IjoibWV6enkiLCJhIjoiY2tqcnczMjl3M3UzcDJ6bG9md3gyYWtreSJ9.uVCzcLF4XYCB_R4U19SnBw';

// async function getLayerAPIToken() {
//   const stored = sessionStorage.getItem('ph_map_api_token') || '5b4b263eeaab78bec883b99cb56deb7c';
//   if (stored) {
//     return Promise.resolve({ data: { token: stored } });
//   }
//   return getLayerAccessToken();
// }
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
    default:
      return state;
  }
}

function generateOptions(values) {
  // @ts-ignore
  return Object.entries(values).map(([k, v]) => ({ label: v, value: k }));
  // return Object.entries(values).map(([k, v]) => (<Select.Option value={k} key={k}>{v}</Select.Option>));
}

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

// function flattenTree(tree) {
//   if (!tree || tree.length === 0) {
//     return [];
//   }
//   let flattened = tree;
//   tree.forEach((node) => {
//     flattened = flattened.concat(flattenTree(node.children));
//   });
//   return flattened;
// }
// 点击的地块的类型

function FarmlandMap({ user, regions, authorizations }:any) {
  let BEFORECATEGORY = -1;

  // map states
  const mapContainer:any = useRef(null);
  const mapRef = useRef<MutableRefObject<any>>();
  const mapControlRef = useRef<MutableRefObject<any>>();
  const [lng] = useState(121.13);
  const [lat] = useState(30.70);
  const [zoom] = useState(12);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [selected, dispatch] = useReducer(selectedReducer, []);
  const [clickedEntry, setClickedEntry]:any = useState();
  const [isLoadingFarmlands, setIsLoadingFarmlands] = useState(false);
  const [selectedMetadata, setSelectedMetadata]:any = useState({});
  const [mapData, setMapData]:any = useState(null);
  // filter states
  const [region, setRegion] = useState([user.city_id, user.town_id, user.village_id]);
  const [year, setYear]:any = useState<Moment | null>(moment().startOf("year"));
  const [season, setSeason]:any = useState<any[]>([getCurrentSeason()]);
  const [categoryRoot, setCategoryRoot] = useState();
  const [categoryRootList, setCategoryRootList]:any = useState<any[]>();
  const [categoryTree, setCategoryTree] = useState<CascaderOptionType[]>([]);
  // stats states
  const [stats, setStats] = useState({ claimantCount: 0, claimed: 0, unclaimed: 0 });
  // modal states
  const [isFormVisible, setIsFormVisible] = useState(false);
  const sourceDataRef = useRef(new Map());
  const mapLayersRef = useRef(new Map());
  const isVillageOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, "/agriculture-subsidies/farmland-map").includes(USER_TYPES.VILLAGE_OFFICIAL)), [user, authorizations]);
  const isTownOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, "/agriculture-subsidies/farmland-map").includes(USER_TYPES.TOWN_OFFICIAL)), [user, authorizations]);
  const isCityOfficial = useMemo(() => (findAuthorizationsByPath(authorizations, "/agriculture-subsidies/farmland-map").includes(USER_TYPES.CITY_OFFICIAL)), [user, authorizations]);

  const loadGeometryData = async () => {
    setIsLoadingFarmlands(true);
    dispatch({ type: "clear" });
    setSelectedMetadata({ year, season, region });
    try {
      const result = await getLandData({
        regionNames: findRegionNames(regions, region),
        regionIds: region,
        year: year.year(),
        season: seasons[season],
        categoryRootName: typeof categoryRoot === "string" ? categoryRoot : _.last(categoryRoot) // ????
      });
      const parsedData = result.data.data;
      if (parsedData.length === 0) {
        message.info("查询到0条数据");
      }
      const calculatedLabelPoints:any = { type: "FeatureCollection", features: [] };
      const polygons:any = { type: "FeatureCollection", features: [] };
      const sourceDataMap = new Map();
      parsedData.forEach((e) => {
        const {  other_geom_list } = e;
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
      setStats({
        claimantCount: result.data.DeclaredUserNum,
        claimed: result.data.DeclaredNum,
        unclaimed: result.data.NoDeclaredNum
      });
      // mapRef.current?.getSource('label-anchors')?.setData(calculatedLabelPoints);
      // mapRef.current?.getSource('farmlands-source')?.setData(polygons);
      if (calculatedLabelPoints.features.length > 0) {
        // mapRef.current.flyTo({
        //   center: calculatedLabelPoints.features[0].geometry.coordinates,
        //   zoom: 15.52,
        //   duration: 5000,
        // });
      }
      setMapData([polygons, calculatedLabelPoints]);
    } catch (e) {
    } finally {
      setIsLoadingFarmlands(false);
    }
  };

  const initiateMap = async () => {
    const customRenderer = new L.LabelTextCollision({
      collisionFlg: true
    });
    const tianDiTuKey = "6a4522498e001c6ec374d880898dfacd";
    const baseLayerTianDiTu = L.tileLayer(`https://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=${tianDiTuKey}`, {
      maxZoom: 18,
      subdomains: [0, 1, 2, 3, 4, 5, 6, 7]
    });
    L.tileLayer("http://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    });
    const map = new L.Map(mapContainer.current, {
      layers: [baseLayerTianDiTu],
      minZoom: 10,
      maxZoom: 18,
      maxBounds: [[28, 119], [32, 123]],
      zoomSnap: 0.01,
      zoomDelta: 0.1,
      zoomControl: false,
      renderer: customRenderer
      // preferCanvas: true,
      // wheelPxPerZoomLevel: 80,
    });
    mapControlRef.current = L.control.layers({
        天地图影像: baseLayerTianDiTu
        // OSM: baseLayerOSM,
      },null,{ position: "topleft" }).addTo(map);
    mapRef.current = map;
    map.on("load", async () => {
      // /* ****************************************************
      // ******************** interactions *********************
      // ***************************************************** */
      setIsMapLoading(false);
    });
    map.setView([lat, lng], zoom);
  };

  // page initialization
  useEffect(() => {
    let isMounted = true;
    getCategoryList()
      .then((result) => {
        if (isMounted) {
          setCategoryTree(transformCategoryTree(result.data));
          const topLevelCategories:any = result.data.map((c) => ({
            label: c.scale_name,
            value: c.id,
            children: c.children && c.children.length ? (c.children.map((b) => ({
              label: b.scale_name,
              value: b.id
            }))) : []
          }));
          // const topLevelCategories = result.data.map((c) => ({ label: c.scale_name, value: c.id, children: c.children && c.children.length ? c.children : [] }));
          // setCategoryRootList([...topLevelCategories, { label: '全部', value: 0 }]);
          setCategoryRootList(topLevelCategories);
          if (season === "1") {
            setCategoryRoot(topLevelCategories[0]?.value);
          } else {
            setCategoryRoot([topLevelCategories[0]?.value, topLevelCategories[0]?.children[0]?.value]);
          }

        }
      })
      .catch((e) => message.error(`补贴项目列表读取失败: ${e.message}`));
    return () => {
      isMounted = false;
      // @ts-ignore
      mapRef.current?.remove();
    };
  }, []);

  // initialize map after user data is loaded
  useEffect(() => {
    if (user && authorizations?.length > 0 && regions.length > 0 && !mapRef.current && categoryRoot) {
      initiateMap();
      // performance issue I guess
      if (!(isTownOfficial || isCityOfficial)) {
        loadGeometryData();
      }
    }
  }, [user, authorizations, regions, categoryRoot]);

  // updated selected display on the map
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
    if (mapRef.current) {
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
        setClickedEntry(e.sourceTarget.feature.properties);
        // const landData = await getLandById(e.features[0].properties.land_id);
        if (isVillageOfficial && e.sourceTarget.feature.properties.declare_id === 0) {
          dispatch({
            type: "toggle",
            item: { ...(e.sourceTarget.feature.properties), id: e.sourceTarget.feature.properties.id }
          });
        }
      });
      mapLayersRef.current.set("selected-lands", newSelectedLandsLayer);
    }
    return () => {
      if (mapRef.current) {
        const prev = mapLayersRef.current.get("selected-lands");
        prev?.off();
        prev?.remove();
      }
    };
  }, [selected]);

  // render farms
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
    if (!isMapLoading && mapData?.[1]?.features.length > 0) {
      const farmlands = L.geoJSON(mapData?.[0], {
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
      farmlands.on("click", (e) => {
        const user_type = (typeof categoryRoot === "string" ? categoryRoot : _.last(categoryRoot))
        const source = e.sourceTarget.feature.properties;
        setClickedEntry(source);
        console.log(source)
        if(source.declare_id !== 0){ // 此时已经申报过
          console.error('当前地块已经申报过')
          return
        }
        if(BEFORECATEGORY == user_type){ // 两次点击的 补贴项目 的类型一致
          console.log('两次点击地块的类型一致，不需一键选中')
          if (isVillageOfficial && source.declare_id === 0) {
            dispatch({
              type: "toggle",
              item: { ...(source), id: source.id }
            });
          }
        }else{
          // feat/2022-06-01: 浙农补粮食地块选择申报时,基于上游给的作物字段进行判断，上游没有对应作物的 不做智能关联。
          console.log('source.plant_type_adopt',source.plant_type_adopt)
          if(source.plant_type_adopt){
            let params = {
              town_name: source.town_name,
              village_name: source.village_name,
              year: selectedMetadata.year.year() || moment(),
              season: seasons[selectedMetadata.season[0]],
              user_type, // 1规模种植  2耕地地力保护 5	旱粮生产补贴 9农业保险  10秸秆还田
              contract_b: source.contract_b,
              contract_b_idcard: source.contract_b_idcard,
              // 种植作物类型 2022-06-01 新增
              plant_type: source.plant_type_adopt
            };
            getVillageAdoptOtherInfo(params).then((res => {
              if (res.code === 0) {
                let data = res.data.data;
                if (data && data.length >= 1) {
                  Modal.confirm({
                    content: `检测到还有${data.length || 0}个地块与你所选地块的承包个体姓名一致，是否一键选中剩余地块！`,
                    icon: <ExclamationCircleOutlined />,
                    onOk: () => {
                      data.map((item) => {
                        if (isVillageOfficial && item.declare_id === 0) {
                          dispatch({
                            type: "toggle",
                            item: { ...(item), id: item.id }
                          });
                        }
                      });
                    }
                  });

                } else {
                  if (isVillageOfficial && source.declare_id === 0) {
                    dispatch({
                      type: "toggle",
                      item: { ...source, id: source.id }
                    });
                  }
                }
              } else {
                message.error(res.msg);
              }
            }));
          }else{
            dispatch({
              type: "toggle",
              item: { ...(source), id: source.id }
            });
          }

        }
        // @ts-ignore
        BEFORECATEGORY = user_type
      });

      farmlands.on("mouseover", (e) => {
        if (e.sourceTarget.feature.properties.declare_id > 0) {
          mapContainer.current.style.cursor = "not-allowed";
        }
      });
      farmlands.on("mouseout", (e) => {
        mapContainer.current.style.cursor = "grab";
      });
      const labelLayer = L.geoJSON(mapData?.[1], {
        pointToLayer(feature, latlng) {
          return L.circleMarker(latlng);
        },
        interactive: false,
        style: (feature) => {
          return {
            stroke: false,
            fillColor: "transparent",
            text: feature.properties.declare_id ? `${feature.properties.real_name}-${feature.properties.land_areamu}亩` : `${feature.properties.village_name}-${_.last(feature.properties.land_id.split("-"))}-${feature.properties.contract_b}`
            // text: `${feature.properties.land_num}\n${feature.properties.contract_num}`,
          };
        }
      }).addTo(mapRef.current);
      // mapControlRef.current.addOverlay(labelLayer, 'labels')
      mapLayersRef.current.set("labels", labelLayer);
      const destination = [...mapData?.[1].features[0]?.geometry.coordinates].reverse();
      mapRef.current?.flyTo(
        destination,
        14,
        {
          duration: 2
        }
      );
      // mapRef.current?.getSource('label-anchors')?.setData(mapData?.[1]);
      // mapRef.current?.getSource('farmlands-source')?.setData(mapData?.[0]);
    }
    return () => {
      if (!isMapLoading && mapData) {
        const prev = mapLayersRef.current.get("farmlands");
        prev?.off();
        prev?.remove();
        mapLayersRef.current.get("labels")?.remove();
      }
    };
  }, [isMapLoading, mapData]);
  /** ***********************************************************************
   ********************** search bar ***************************************
   *********************************************************************** */
  const onRegionChange = (v) => setRegion(validateCascaderValue(user, {
    isCityOfficial,
    isTownOfficial,
    isVillageOfficial
  }, v));
  const onYearChange = useCallback((v) => setYear(v), []);
  const onSeasonChange = useCallback((v) => {
    setSeason([v]);
  }, []);
  const onCategoryRootChange = useCallback((v) => {
    setCategoryRoot(v)
    BEFORECATEGORY = -1;
  }, []);
  const generatedSeasonOptions = useMemo(() => (
    generateOptions(seasons)), [seasons]);
  const openFormModal = useCallback(() => setIsFormVisible(true), []);
  const handleFormCancel = useCallback(() => setIsFormVisible(false), []);
  const handleFormSuccess = () => {
    // setIsFormVisible(false);
    loadGeometryData();
  };
  const setCategory = (val) => {
    setCategoryRoot(val);
  };

  const modalContext = useMemo(() => ({
    region: selectedMetadata.region,
    year: selectedMetadata.year || moment(),
    season: selectedMetadata.season,
    selectedLands: selected,
    selectedCategory: categoryTree,
    categoryTree,
    regionNamePath: findRegionNames(regions, selectedMetadata.region),
    regionTree: regions,
    categoryRoot: categoryRoot
  }), [selected, categoryTree, regions]);

  useEffect(() => {
    const emptyArr:any = [];
    user?.city_id > 0 && emptyArr.push(user.city_id);
    user?.town_id > 0 && emptyArr.push(user.town_id);
    user?.village_id > 0 && emptyArr.push(user.village_id);
    setRegion(emptyArr);
  }, [user, regions]);
  return (
    <PageHeaderWrapper>
      <div className={styles.pageContainer}>
        <div className={styles.searchBar}>
          <div className={styles.filters}>
            <div className={styles.filterParam}>
              <span className={styles.filterLabel}>所属地区:</span>
              <Cascader
                options={regions}
                value={region}
                onChange={onRegionChange}
                disabled={isVillageOfficial && !(isCityOfficial || isTownOfficial)}
                changeOnSelect={isCityOfficial || isTownOfficial}
              />
            </div>
            <div className={styles.filterParam}>
              <span className={styles.filterLabel}>年份:</span>
              <DatePicker
                picker="year"
                allowClear={false}
                value={year}
                onChange={onYearChange}
              />
            </div>
            <div className={styles.filterParam}>
              <span className={styles.filterLabel}>季节:</span>
              <Select
                className={styles.seasonSelector}
                value={season}
                onChange={onSeasonChange}
                options={generatedSeasonOptions}
              />
            </div>
            {
              season === "1" ? (
                <div className={styles.filterParam}>
                  <span className={styles.filterLabel}>补贴项目:</span>
                  <Select
                    options={categoryRootList}
                    className={styles.categorySelector}
                    value={categoryRoot}
                    onChange={onCategoryRootChange}
                  />
                </div>
              ) : (
                <div className={styles.filterParam}>
                  <span className={styles.filterLabel}>补贴项目:</span>
                  <Cascader
                    options={categoryTree}
                    className={styles.categorySelector}
                    value={categoryRoot}
                    onChange={(v) => setCategory(v)}
                  />
                </div>
              )
            }
          </div>
          <div className={styles.searchActions}>
            <Button
              type="primary"
              loading={isLoadingFarmlands}
              onClick={() => {
                loadGeometryData();
              }}
            >
              查询
            </Button>
            <Button onClick={() => {
              setRegion([user.city_id, user.town_id, user.village_id]);
              setYear(moment().startOf("year"));
              setSeason([getCurrentSeason()]);
              setCategoryRoot(categoryRootList[0]?.value);
            }}
            >
              重置
            </Button>
          </div>
        </div>
        <div className={styles.searchBar}>
          <div className={styles.filters}>
            <div className={styles.filterParam}>
              <span className={styles.filterLabel}>
                {_.last(findRegionNames(regions, region)) ?? ""}
                已申报:
              </span>
              {stats.claimantCount ?? "?"}
              户
            </div>
            <div className={styles.filterParam}>
              <span className={styles.filterLabel}>已领地块:</span>
              {stats.claimed ?? "?"}
              块
            </div>
            <div className={styles.filterParam}>
              <span className={styles.filterLabel}>未领地块:</span>
              {stats.unclaimed ?? "?"}
              块
            </div>
          </div>
          <div className={styles.searchActions}>
            {
              isVillageOfficial
                ? (
                  <Button
                    type="primary"
                    disabled={!(selected?.length > 0)}
                    onClick={() => {
                      openFormModal();
                    }}
                  >
                    {selected?.length > 1 ? `批量申报(${selected?.length})` : "申报"}
                  </Button>
                ) : null
            }
          </div>
        </div>
        <Spin indicator={<LoadingOutlined />} spinning={isMapLoading} tip="准备地图中">
          <div className={styles.mapContainer} id="mapContainer" ref={mapContainer} />
          <div className={styles.legendContainer}>
            <div className={styles.legend}>
              <span style={{ minWidth: "5ch", background: unclaimedOutlineColor }} />
              未申报边界
            </div>
            <div className={styles.legend}>
              <span style={{ minWidth: "5ch", background: pendingOutlineColor }} />
              待公示地块
            </div>
            <div className={styles.legend}>
              <span style={{ minWidth: "5ch", background: postedOutlineColor }} />
              公示中地块
            </div>
            <div className={styles.legend}>
              <span style={{ minWidth: "5ch", background: claimedOutlineColor }} />
              已申报地块
            </div>
            <div className={styles.legend}>
              <span style={{ minWidth: "5ch", background: "rgb(109,153,255)" }} />
              选择的地块
            </div>
          </div>
        </Spin>
        <div className={styles.landOverview}>
          <h3 style={{ fontWeight: "bolder" }}>地块信息</h3>
          <article className={styles.landDetails}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>所属地区:</span>
              {clickedEntry?.town_name}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>地块编号:</span>
              {clickedEntry?.land_num}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>地块面积(亩):</span>
              {clickedEntry?.land_areamu === undefined ? "" : _.round(clickedEntry.land_areamu, 1)}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>申报用户:</span>
              {clickedEntry?.["real_name"]}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>补贴项目:</span>
              {traverseTree(categoryTree, [geoJSONNullCheck(clickedEntry?.scale_parent_id), geoJSONNullCheck(clickedEntry?.scale_id)], "value", "label")}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>
                性质:
                {ownershipTypes[clickedEntry?.subsidy_type] ?? ""}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>年份:</span>
              {clickedEntry?.plant_year}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>种植作物:</span>
              {geoJSONNullCheck(clickedEntry?.plant_type)}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>季节:</span>
              {clickedEntry?.plant_season}
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>地块状态:</span>
              {clickedEntry?.declare_id === undefined ? ""
                : clickedEntry.declare_id === 0 ? "未申报" : "已申报"}
            </div>
          </article>
        </div>
      </div>
      <LandClaimFilingModal
        action={"create"}
        context={modalContext}
        visible={isFormVisible}
        accountInfo={user}
        onFinish={() => setIsFormVisible(false)}
        cancelCb={handleFormCancel}
        successCb={handleFormSuccess}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regions: info.areaList
}))(FarmlandMap);
