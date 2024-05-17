import { useState } from "react";
import MasterMahasiswaIndex from "./Index";
import MasterMahasiswaAdd from "./Add";
import MasterMahasiswaDetail from "./Detail";
import MasterMahasiswaEdit from "./Edit";

export default function MasterMahasiswa() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterMahasiswaIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterMahasiswaAdd onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterMahasiswaDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
          <MasterMahasiswaEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(mode, withID) {
    setDataID(withID);
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
}
