let { Virtual, VirtualDom } = window.interfaces;
import RootComponent from "./root/RootComponent.js"

VirtualDom.render(<RootComponent />, document.getElementById("root"));
