// Your first component...
let { Virtual } = window.interfaces;
import { TRACKING } from "../root/routeDependencies.js";

class Flow extends Virtual.PureComponent {
    constructor() {
        super(...arguments);
    }
 
    attachedCallback() {
        try {
            // tracking with newMonk & GA
            /*requirejs(TRACKING, ({ trackNewMonkAndGA }) => {
                trackNewMonkAndGA(this.props.route);
            });*/
        } catch (e) {
            console.warn(e);
        }
    }

    detachedCallback() {
    }
    
    render() {
        return <div>
            <p>Write your first component here...</p>
        </div>
    }


}

export default Flow;
