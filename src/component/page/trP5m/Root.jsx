import { useState } from "react";
import TrP5mIndex from "./Index";
// import TrP5mAdd from "./Add";

export default function TrP5m() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <TrP5mIndex onChangePage={handleSetPageMode} 
        withID={dataID}
        />;
      case "add":
        return <TrP5mAdd onChangePage={handleSetPageMode}
        withID={dataID}
        />;
      default:
        return null; // Ensure it returns a value in the default case
    }
  }

  function handleSetPageMode(mode, withID = null) {
    setDataID(withID);
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
}
