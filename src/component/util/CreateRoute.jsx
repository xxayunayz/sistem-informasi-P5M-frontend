import { lazy } from "react";

const Beranda = lazy(() => import("../page/beranda/Root"));
const MasterPelanggan = lazy(() => import("../page/master-pelanggan/Root"));
const MasterProduk = lazy(() => import("../page/master-produk/Root"));
const MasterProses = lazy(() => import("../page/master-proses/Root"));
const MasterKursProses = lazy(() => import("../page/master-kurs-proses/Root"));
const MasterAlatMesin = lazy(() => import("../page/master-alat-mesin/Root"));
const MasterOperator = lazy(() => import("../page/master-operator/Root"));
const MasterPic = lazy(() => import("../page/master-pic/Root"));
const MasterKelas = lazy(() => import("../page/master-kelas/Root"));
const PermintaanPelanggan = lazy(() =>
  import("../page/permintaan-pelanggan/Root")
);

const routeList = [
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/master_pelanggan",
    element: <MasterPelanggan />,
  },
  {
    path: "/master_produk",
    element: <MasterProduk />,
  },
  {
    path: "/master_proses",
    element: <MasterProses />,
  },
  {
    path: "/master_kurs_proses",
    element: <MasterKursProses />,
  },
  {
    path: "/master_alat_mesin",
    element: <MasterAlatMesin />,
  },
  {
    path: "/master_operator",
    element: <MasterOperator />,
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
    path: "/permintaan_pelanggan",
    element: <PermintaanPelanggan />,
  },
];

export default routeList;
