// Your first container...
let { connect } = window.interfaces;
import Flow from './Flow.js';

const mapStateToProps = (state, ownProps) => {
    return {
        route: state.route
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
          
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Flow);
