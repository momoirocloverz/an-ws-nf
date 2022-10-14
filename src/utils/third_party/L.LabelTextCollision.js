/* eslint-disable no-underscore-dangle */
// Adopted from https://github.com/yakitoritabetai/Leaflet.LabelTextCollision
import L from 'leaflet';

L.LabelTextCollision = L.Canvas
  .extend({

    options: {
      /**
       * Collision detection
       */
      collisionFlg: true,
    },

    initialize(options) {
      options = L.Util.setOptions(this, options);
      // add
      L.Util.stamp(this);
      this._layers = this._layers || {};
    },

    _handleMouseHover(e, point) {
      if (this._mouseHoverThrottled) {
        return;
      }

      var layer, candidateHoveredLayer;

      for (var order = this._drawFirst; order; order = order.next) {
        layer = order.layer;
        if (layer.options.interactive && layer._containsPoint(point)) {
          candidateHoveredLayer = layer;
        }
      }

      if (candidateHoveredLayer !== this._hoveredLayer) {
        this._handleMouseOut(e);

        if (candidateHoveredLayer) {
          L.DomUtil.addClass(this._container, "leaflet-interactive"); // change cursor
          this._fireEvent([candidateHoveredLayer], e, "mouseover");
          this._hoveredLayer = candidateHoveredLayer;
        }
      }

      if (this._hoveredLayer) {
        this._fireEvent([this._hoveredLayer], e);
      }

      this._mouseHoverThrottled = true;
      setTimeout(
        L.Util.bind(function () {
          this._mouseHoverThrottled = false;
        }, this),
        32
      );
    },

    _handleMouseOut(e) {
      var layer = this._hoveredLayer;
      if (layer) {
        // if we're leaving the layer, fire mouseout
        L.DomUtil.removeClass(this._container, 'leaflet-interactive');
        this._fireEvent([layer], e, 'mouseout');
        this._hoveredLayer = null;
        this._mouseHoverThrottled = false;
      }
    },

    _updateTransform(center, zoom) {
      L.Canvas.prototype._updateTransform.call(this, center, zoom);

      const scale = this._map.getZoomScale(zoom, this._zoom); const position = L.DomUtil
        .getPosition(this._container); const viewHalf = this._map
        .getSize().multiplyBy(0.5 + this.options.padding); const currentCenterPoint = this._map
        .project(this._center, zoom); const destCenterPoint = this._map
        .project(center, zoom); const centerOffset = destCenterPoint
        .subtract(currentCenterPoint);

      const topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(
        viewHalf,
      ).subtract(centerOffset);

      if (L.Browser.any3d) {
        L.DomUtil.setTransform(this._containerText, topLeftOffset,
          scale);
      } else {
        L.DomUtil.setPosition(this._containerText, topLeftOffset);
      }
    },
    _initContainer(options) {
      L.Canvas.prototype._initContainer.call(this);

      this._containerText = document.createElement('canvas');

      L.DomEvent.on(this._containerText, 'mousemove',
        L.Util.throttle(this._onMouseMove, 32, this), this).on(
        this._containerText,
        'click dblclick mousedown mouseup contextmenu',
        this._onClick, this,
      ).on(this._containerText,
        'mouseout', this._handleMouseOut, this);

      this._ctxLabel = this._containerText.getContext('2d');

      L.DomUtil
        .addClass(this._containerText, 'leaflet-zoom-animated');
      this.getPane().appendChild(this._containerText);
    },

    _update() {
      // textList
      this._textList = [];

      L.Renderer.prototype._update.call(this);
      const b = this._bounds; const container = this._containerText; const size = b
        .getSize(); const
        m = L.Browser.retina ? 2 : 1;

      L.DomUtil.setPosition(container, b.min);

      // set canvas size (also clearing it); use double size on retina
      container.width = m * size.x;
      container.height = m * size.y;
      container.style.width = `${size.x}px`;
      container.style.height = `${size.y}px`;

      // display text on the whole surface
      container.style.zIndex = '4';
      this._container.style.zIndex = '3';

      if (L.Browser.retina) {
        this._ctxLabel.scale(2, 2);
      }

      // translate so we use the same path coordinates after canvas
      // element moves
      this._ctxLabel.translate(-b.min.x, -b.min.y);
      L.Canvas.prototype._update.call(this);
    },

    _updatePoly(layer, closed) {
      L.Canvas.prototype._updatePoly.call(this, layer, closed);
      this._text(this._ctxLabel, layer);
    },

    _updateCircle(layer) {
      L.Canvas.prototype._updateCircle.call(this, layer);
      this._text(this._ctxLabel, layer);
    },

    _text(ctx, layer) {
      if (layer.options.text != undefined) {
        ctx.globalAlpha = 1;

        let p = layer._point;
        let textPoint;

        if (p == undefined) {
          // polygon or polyline
          if (layer._parts.length == 0
            || layer._parts[0].length == 0) {
            return;
          }
          p = this._getCenter(layer._parts[0]);
        }

        /**
         * TODO setting for custom font
         */
        ctx.lineWidth = 4.0;
        const fontSize = 16;
        ctx.font = `${fontSize}px sans-serif`;
        // Multiline support, not recommended as it might scales linearly
        const textArray = layer.options.text.split('\n');
        const widths = textArray.map((text) => ctx.measureText(text).width);
        const largestWidth = Math.max(...widths);
        // label bounds offset
        const offsetX = 0;
        const offsetY = 0;
        // Collision detection
        const right = p.x + offsetX + largestWidth / 2;// + offsetX;
        const bottom = p.y + offsetY + 20 + fontSize * (textArray.length - 1);
        const bounds = L.bounds(
          L.point(p.x + offsetX - largestWidth / 2, p.y + offsetY), L.point(
            right, bottom,
          ),
        );
        if (this.options.collisionFlg) {
          for (const index in this._textList) {
            const pointBounds = this._textList[index];
            if (pointBounds.intersects(bounds)) {
              return;
            }
          }
        }
        this._textList.push(bounds);
        if (layer.options.textColor == undefined) {
          ctx.fillStyle = 'white';
        } else {
          ctx.fillStyle = layer.options.textColor;
        }
        ctx.strokeStyle = 'black';
        textArray.forEach((text, idx) => {
          ctx.strokeText(text, p.x + offsetX + widths[idx] / -2, p.y
            + offsetY + fontSize * idx);
          ctx.fillText(text, p.x + offsetX + widths[idx] / -2, p.y
            + offsetY + fontSize * idx);
        });
      }
    },

    _getCenter(points) {
      let i; let halfDist; let segDist; let dist; let p1; let p2; let ratio; const
        len = points.length;

      if (!len) {
        return null;
      }

      // polyline centroid algorithm; only uses the first ring if
      // there are multiple

      for (i = 0, halfDist = 0; i < len - 1; i++) {
        halfDist += points[i].distanceTo(points[i + 1]) / 2;
      }

      // The line is so small in the current view that all points are
      // on the same pixel.
      if (halfDist === 0) {
        return points[0];
      }

      for (i = 0, dist = 0; i < len - 1; i++) {
        p1 = points[i];
        p2 = points[i + 1];
        segDist = p1.distanceTo(p2);
        dist += segDist;

        if (dist > halfDist) {
          ratio = (dist - halfDist) / segDist;
          const resutl = [p2.x - ratio * (p2.x - p1.x),
            p2.y - ratio * (p2.y - p1.y)];

          return L.point(resutl[0], resutl[1]);
        }
      }
    },

  });
