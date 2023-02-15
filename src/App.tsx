import React from "react";
import useUrlState from "./hooks/useUrlState";

export default function App() {
  const res = useUrlState(1, {});
  console.log(res);
  return <div>App</div>;
}
