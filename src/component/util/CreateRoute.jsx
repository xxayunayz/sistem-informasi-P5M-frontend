import { lazy } from "react";

const Beranda = lazy(() => import("../page/beranda/Root"));
const MasterPic = lazy(() => import("../page/master-pic/Root"));
const MasterKelas = lazy(() => import("../page/master-kelas/Root"));
const TrP5m = lazy(() => import("../page/trP5m/Root"));

const routeList = [
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/master_pic",
    element: <MasterPic />,
  },
  {
    path: "/master_kelas",
    element: <MasterKelas />,
  },
  {
    path: "/trp5m",
    element: <TrP5m/>,
  },
  // {
  //   path: "/detail_p5m",
  //   element: <DetailP5m/>,
  // },
];

export default routeList;
