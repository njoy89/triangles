import React, { Component, PropTypes } from 'react';
import Plane from './plane';
import Immutable from 'immutable';

export default class App extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            data: Immutable.fromJS({
                point: {
                    x: 350,
                    y: 470
                },
                triangles: [
                    {
                        x1: 100,
                        y1: 100,
                        x2: 200,
                        y2: 300,
                        x3: 300,
                        y3: 200
                    },
                    {
                        x1: 500,
                        y1: 900,
                        x2: 700,
                        y2: 700,
                        x3: 550,
                        y3: 650
                    }
                ]
            })
        };

        this.updateTriangleCords = this.updateTriangleCords.bind(this);
        this.updatePointCords = this.updatePointCords.bind(this);
    }
    updateTriangleCords(i, vx, vy) {
        this.setState(({ data }) => ({
            data: data.
                update(
                    'triangles',
                    arr => arr.
                        update(i, cord => cord.
                        update('x1', v => v + vx).
                        update('y1', v => v + vy).
                        update('x2', v => v + vx).
                        update('y2', v => v + vy).
                        update('x3', v => v + vx).
                        update('y3', v => v + vy)
                    )
                )
        }));
    }
    updatePointCords(cords) {
        this.setState(({ data }) => ({
            data: data.
                updateIn(['point', 'x'], v => cords.x).
                updateIn(['point', 'y'], v => cords.y)
        }));
    }
    render() {
        return (
            <div className="container">
                <div className="section">
                    <p>A point and a set of triangles are given on the 2D plane.</p>
                    <h5>How many triangles are seen from the point?</h5>
                    <p>The following conditions are satisfied:</p>
                    <ul>
                        <li>a triangle is seen from the point if and only if there exists ...;</li>
                        <li>each pair of triangles might overlap each other;</li>
                        <li>if the point lays inside a triangle, this triangle hide all triangles that don't contain the point inside them.</li>
                    </ul>
                </div>
                <div className="wrapper card-panel yellow lighten-2 z-depth-3">
                    <Plane
                        point={ this.state.data.get('point') }
                        triangles={ this.state.data.get('triangles') }
                        updateTriangleCords={ this.updateTriangleCords }
                        updatePointCords={ this.updatePointCords }
                    />
                </div>
            </div>
        );
    }
}
