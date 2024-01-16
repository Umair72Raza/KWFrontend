import HomePageWorker from "../Views/HomePageWorker/HomePageWorker";

const WorkerRoutes = [
  {
    path: "/workerHomepage",
    name: "workerhomepage",
    component: <HomePageWorker />,
    layout: "/worker",
  },
];

export default WorkerRoutes;
