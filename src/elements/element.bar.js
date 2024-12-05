import Element from '../core/core.element';
import {toTRBL, toRadiusObject} from '../helpers/helpers.options';

/**
 * Helper function to get the bounds of the bar regardless of the orientation
 * @param {BarElement} bar the bar
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the bar
 * @private
 */
function getBarBounds(bar, useFinalPosition) {
	const {x, y, base, width, height} = bar.getProps(['x', 'y', 'base', 'width', 'height'], useFinalPosition);

	let left, right, top, bottom, half;

	if (bar.horizontal) {
		half = height / 2;
		left = Math.min(x, base);
		right = Math.max(x, base);
		top = y - half;
		bottom = y + half;
	} else {
		half = width / 2;
		left = x - half;
		right = x + half;
		top = Math.min(y, base);
		bottom = Math.max(y, base);
	}

	return {left, top, right, bottom};
}

function parseBorderSkipped(bar) {
	let edge = bar.options.borderSkipped;
	const res = {};

	if (!edge) {
		return res;
	}

	edge = bar.horizontal
		? parseEdge(edge, 'left', 'right', bar.base > bar.x)
		: parseEdge(edge, 'bottom', 'top', bar.base < bar.y);

	res[edge] = true;
	return res;
}

function parseEdge(edge, a, b, reverse) {
	if (reverse) {
		edge = swap(edge, a, b);
		edge = startEnd(edge, b, a);
	} else {
		edge = startEnd(edge, a, b);
	}
	return edge;
}

function swap(orig, v1, v2) {
	return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}

function startEnd(v, start, end) {
	return v === 'start' ? start : v === 'end' ? end : v;
}

function skipOrLimit(skip, value, min, max) {
	return skip ? 0 : Math.max(Math.min(value, max), min);
}

function parseBorderWidth(bar, maxW, maxH) {
	const value = bar.options.borderWidth;
	const skip = parseBorderSkipped(bar);
	const o = toTRBL(value);

	return {
		t: skipOrLimit(skip.top, o.top, 0, maxH),
		r: skipOrLimit(skip.right, o.right, 0, maxW),
		b: skipOrLimit(skip.bottom, o.bottom, 0, maxH),
		l: skipOrLimit(skip.left, o.left, 0, maxW)
	};
}

function getBorderRadius(bar, width, height, borderWidth) {
	const radius = bar.options.borderRadius;
	const maximumRadius = Math.min(width, height) / 2;
	const o = toRadiusObject(radius);
	const skip = parseBorderSkipped(bar);

	const outerRadius = [
		skipOrLimit(skip.top || skip.left, o.topLeft, 0, maximumRadius),
		skipOrLimit(skip.right || skip.top, o.topRight, 0, maximumRadius),
		skipOrLimit(skip.bottom || skip.right, o.bottomRight, 0, maximumRadius),
		skipOrLimit(skip.bottom || skip.left, o.bottomLeft, 0, maximumRadius)
	];

	const innerRadius = [
		Math.max(outerRadius[0] - Math.max(borderWidth.l, borderWidth.t), 0),
		Math.max(outerRadius[1] - Math.max(borderWidth.r, borderWidth.t), 0),
		Math.max(outerRadius[2] - Math.max(borderWidth.r, borderWidth.b), 0),
		Math.max(outerRadius[3] - Math.max(borderWidth.l, borderWidth.b), 0)
	];

	return {
		outerRadius,
		innerRadius
	};
}

function boundingRects(bar) {
	const bounds = getBarBounds(bar);
	const width = bounds.right - bounds.left;
	const height = bounds.bottom - bounds.top;
	const border = parseBorderWidth(bar, width / 2, height / 2);
	const {outerRadius, innerRadius} = getBorderRadius(bar, width, height, border);

	return {
		outer: {
			x: bounds.left,
			y: bounds.top,
			w: width,
			h: height,
			radius: outerRadius
		},
		inner: {
			x: bounds.left + border.l,
			y: bounds.top + border.t,
			w: width - border.l - border.r,
			h: height - border.t - border.b,
			radius: innerRadius
		}
	};
}

function inRange(bar, x, y, useFinalPosition) {
	const skipX = x === null;
	const skipY = y === null;
	const skipBoth = skipX && skipY;
	const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);

	return bounds
		&& (skipX || x >= bounds.left && x <= bounds.right)
		&& (skipY || y >= bounds.top && y <= bounds.bottom);
}

export default class BarElement extends Element {

	constructor(cfg) {
		super();

		this.options = undefined;
		this.horizontal = undefined;
		this.base = undefined;
		this.width = undefined;
		this.height = undefined;

		if (cfg) {
			Object.assign(this, cfg);
		}
	}

	draw(ctx) {
		const options = this.options;
		const {inner, outer} = boundingRects(this);

		ctx.save();

		if (outer.w !== inner.w || outer.h !== inner.h) {
			ctx.beginPath();
			ctx.roundRect(outer.x, outer.y, outer.w, outer.h, outer.radius);
			ctx.clip();
			ctx.roundRect(inner.x, inner.y, inner.w, inner.h, inner.radius);
			ctx.fillStyle = options.borderColor;
			ctx.fill('evenodd');
		}

		ctx.beginPath();
		ctx.roundRect(inner.x, inner.y, inner.w, inner.h, inner.radius);
		ctx.fillStyle = options.backgroundColor;
		ctx.fill();

		ctx.restore();
	}

	inRange(mouseX, mouseY, useFinalPosition) {
		return inRange(this, mouseX, mouseY, useFinalPosition);
	}

	inXRange(mouseX, useFinalPosition) {
		return inRange(this, mouseX, null, useFinalPosition);
	}

	inYRange(mouseY, useFinalPosition) {
		return inRange(this, null, mouseY, useFinalPosition);
	}

	getCenterPoint(useFinalPosition) {
		const {x, y, base, horizontal} = this.getProps(['x', 'y', 'base', 'horizontal'], useFinalPosition);
		return {
			x: horizontal ? (x + base) / 2 : x,
			y: horizontal ? y : (y + base) / 2
		};
	}

	getRange(axis) {
		return axis === 'x' ? this.width / 2 : this.height / 2;
	}
}

BarElement.id = 'bar';

/**
 * @type {any}
 */
BarElement.defaults = {
	borderSkipped: 'start',
	borderWidth: 0,
	borderRadius: 0
};

/**
 * @type {any}
 */
BarElement.defaultRoutes = {
	backgroundColor: 'color',
	borderColor: 'color'
};
