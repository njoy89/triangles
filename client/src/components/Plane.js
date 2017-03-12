import React, { Component } from 'react';
import d3 from 'd3';

const MAX_X_CORD = 1000;
const MAX_Y_CORD = 1000;

export default class Plane extends Component {
    constructor(...args) {
        super(...args);
    }
    renderAxes(planeElement, xScale, yScale) {
        const xAxis = d3.svg.axis().
            scale(xScale).
            tickSize(5, 2).
            orient('top');

        const yAxis = d3.svg.axis().
            scale(yScale).
            innerTickSize(5).
            outerTickSize(2).
            orient('left');

        d3.select(planeElement).
            append('g').
            attr('class', 'plane__axis').
            call(xAxis).
            selectAll('text').
            classed('plane__axis-text', true);

        d3.select(planeElement).
            append('g').
            attr('class', 'plane__axis').
            call(yAxis).
            selectAll('text').
            attr('transform', 'rotate(270)').
            attr('x', 0).
            attr('dy', -8).
            style('text-anchor', 'middle').
            classed('plane__axis-text', true);
    }
    renderGrid(planeElement, xScale, yScale) {
        d3.select(planeElement).
            selectAll('line.plane__grid-horizontal-line').
            data(xScale.ticks(10).slice(1)).
            enter().
            append('line').
            attr({
                class: 'plane__grid-horizontal-line',
                x1: d => xScale(d),
                y1: 0,
                x2: d => xScale(d),
                y2: yScale(MAX_Y_CORD)
            });

        d3.select(planeElement).
            selectAll('line.plane__grid-vertical-line').
            data(yScale.ticks(10).slice(1)).
            enter().
            append('line').
            attr({
                class: 'plane__grid-vertical-line',
                x1: 0,
                y1: d => yScale(d),
                x2: xScale(MAX_X_CORD),
                y2: d => yScale(d)
            });
    }
    renderPoint(planeElement, xScale, yScale, propsPoint) {
        const radius = 6;
        const context = this;

        const dragMove = function () {
            d3.select(this).
                attr('cx', Math.max(0, Math.min(xScale(MAX_X_CORD), d3.event.x))).
                attr('cy', Math.max(0, Math.min(yScale(MAX_Y_CORD), d3.event.y)));
        };

        const dragEnd = function () {
            const cxValue = parseFloat(d3.select(this).attr('cx'));
            const cyValue = parseFloat(d3.select(this).attr('cy'));

            context.props.updatePointCords({
                x: xScale.invert(cxValue),
                y: yScale.invert(cyValue)
            });
        };

        const point = d3.select(planeElement).
            append('circle').
            classed('plane__circle', true).
            attr({
                cx: xScale(propsPoint.get('x')),
                cy: yScale(propsPoint.get('y')),
                r: radius
            }).
            on('mouseover', function () {
                d3.select(this).attr('r', 8);
            }).
            on('mouseout', function () {
                d3.select(this).attr('r', radius);
            });

        const drag = d3.behavior.drag().
            on('drag', dragMove).
            on('dragend', dragEnd);

        point.call(drag);
    }
    renderTrangles(planeElement, xScale, yScale, propsTriangles) {
        const context = this;
        const radius = 5;
        const trianglesElements = d3.select(planeElement).
            selectAll('g.plane__triangle').
            data(propsTriangles.toJS()).
            enter().
            append('g').
            classed('plane__triangle', true);
        const appendPoint = (x, y) => {
            trianglesElements.
            append('circle').
            classed('plane__triangle-vertex', true).
            attr({
                cx: d => xScale(d[x]),
                cy: d => yScale(d[y]),
                r: radius
            });
        };
        const appendInterior = () => {
            trianglesElements.
            append('polygon').
            attr('points', d => [
                `${xScale(d.x1)},${yScale(d.y1)}`,
                `${xScale(d.x2)},${yScale(d.y2)}`,
                `${xScale(d.x3)},${yScale(d.y3)}`
            ].join(' ')).
            classed('plane__triangle-interior', true);
        };
        const makeTrangleDraggable = () => {
            let startDragX = null;
            let startDragY = null;

            const getVector = (d, mouseCords) => {
                const minX = xScale(Math.min(d.x1, d.x2, d.x3));
                const minY = yScale(Math.min(d.y1, d.y2, d.y3));
                const maxX = xScale(Math.max(d.x1, d.x2, d.x3));
                const maxY = yScale(Math.max(d.y1, d.y2, d.y3));

                return [
                    Math.max(
                        -minX,
                        Math.min(xScale(MAX_X_CORD) - maxX, mouseCords.x - startDragX)
                    ),
                    Math.max(
                        -minY,
                        Math.min(yScale(MAX_Y_CORD) - maxY, mouseCords.y - startDragY)
                    )
                ];
            };

            const dragStart = function (d) {
                [startDragX, startDragY] = d3.mouse(context.refs.plane);
            };

            const dragMove = function (d) {
                const [ mouseX, mouseY ] = d3.mouse(context.refs.plane);
                const [vx, vy] = getVector(d, {
                    x: mouseX,
                    y: mouseY
                });

                d3.select(this).
                    attr('transform', `translate(${vx},${vy})`);
            };

            const dragEnd = function (d, i) {
                const [ mouseX, mouseY ] = d3.mouse(context.refs.plane);
                const [vx, vy] = getVector(d, {
                    x: mouseX,
                    y: mouseY
                });

                context.props.updateTriangleCords(i, xScale.invert(vx), xScale.invert(vy));

                startDragX = null;
                startDragY = null;
            };

            const drag = d3.behavior.drag().
                on('dragstart', dragStart).
                on('drag', dragMove).
                on('dragend', dragEnd);

            trianglesElements.call(drag);
        };

        appendInterior();
        appendPoint('x1', 'y1');
        appendPoint('x2', 'y2');
        appendPoint('x3', 'y3');
        makeTrangleDraggable();
    }
    renderPlane(propsPoint, propsTriangles) {
        const planeElement = this.refs.plane;
        const { width, height } = planeElement.getBoundingClientRect();

        const xScale = d3.scale.linear().
            domain([0, MAX_X_CORD]).
            range([0, width]);

        const yScale = d3.scale.linear().
            domain([0, MAX_Y_CORD]).
            range([0, height]);

        this.renderAxes(planeElement, xScale, yScale);
        this.renderGrid(planeElement, xScale, yScale);
        this.renderTrangles(planeElement, xScale, yScale, propsTriangles);
        this.renderPoint(planeElement, xScale, yScale, propsPoint);
    }
    componentDidMount() {
        this.renderPlane(this.props.point, this.props.triangles);
    }
    componentWillReceiveProps(nextProps) {
        d3.select(this.refs.plane).selectAll('*').remove();
        this.renderPlane(nextProps.point, nextProps.triangles);
    }
    render() {
        return (
            <svg ref='plane' className='plane' />
        );
    }
}

Plane.propTypes = {
    point: React.PropTypes.object,
    triangles: React.PropTypes.object,
    updatePointCords: React.PropTypes.func.isRequired,
    updateTriangleCords: React.PropTypes.func.isRequired
};
