
export default class Offline {
    constructor(rootActions, globalState) {
        this.rootActions = rootActions;
        this.interval = null;
        this.checkInInterval();
        this.globalState = globalState;
        this.render();
    }
    onStateChange(state) {
        this.globalState = state;
    }
    onRequestSuccess() {
        if (!this.globalState.app.online) {
            this.rootActions.appOnline();
            this.render();
        }
        //this.resetInterval();
    }
    onRequestFailure() {
        if (this.globalState.app.online) {
            this.rootActions.appOffline();
            this.render();
        }
        //this.resetInterval();
    }
    checkThroughPixel() {
        $.ajaxPromise({
            "url": "./favicon.icon",
        }).then(() => {
            this.onRequestSuccess();
        }, () => {
        	this.onRequestFailure();
        });
    }
    checkInInterval() {        
        this.interval = setInterval(() => { this.checkThroughPixel() }, 3000);
    }
    resetInterval(){
    	clearInterval(this.interval);
    	this.checkInInterval();
    }
    render() {
        requestAnimationFrame(() => {
            document.body.style.filter = `grayScale(${this.globalState.app.online?0:1})`;
        });
    }
}
