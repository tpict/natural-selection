import React from "react";
import { Link, Route, Switch } from "react-router-dom";

export const Examples: React.FC = () => (
  <>
    <Link to="/examples/single-select">Single select</Link>

    <Switch>
      <Route path="/examples/single-select">YOOOoO</Route>
    </Switch>
  </>
);
