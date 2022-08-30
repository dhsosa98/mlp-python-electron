import { Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import ProductsRoute from "./default/index";

export function Home() {
  return (
    <HashRouter >
        <Route path="/"  component={ProductsRoute} />
    </HashRouter>
  );
}
