import HomePageWorker from "./Views/HomePageWorker/HomePageWorker";

const routes = [
  {
    path: "/workerHomepage",
    name: "workerhomepage",
    component: <HomePageWorker />,
    layout: "/worker",
  },
];

export default routes;
