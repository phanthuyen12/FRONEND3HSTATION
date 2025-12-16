import React, { useEffect, useState } from "react";
import Header1 from "./Components/Header/Header1.jsx";
import Footer1 from "./Components/Footer/Footer1.jsx";
import Home from "./Pages/Home.jsx";

import { vpsService, elearningService, workflowsService } from "../../config";
import type { VpsPlan } from "../../services/vpsService";
import type { Course } from "../../services/elearningService";
import type { Workflow } from "../../services/workflowsService";

import "./assets/main.css";
import "slick-carousel/slick/slick.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const TechxenLanding: React.FC = () => {
  const [plans, setPlans] = useState<VpsPlan[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [planData, courseData, workflowData] = await Promise.all([
          vpsService.fetchClientPlans().catch(() => []),
          elearningService.getCourses().catch(() => []),
          workflowsService
            .fetchAdminWorkflows({ limit: 6 })
            .then((res: any) => (Array.isArray(res.data) ? res.data : res?.data || []))
            .catch(() => []),
        ]);
        setPlans(Array.isArray(planData) ? planData.slice(0, 6) : []);
        setCourses(Array.isArray(courseData) ? courseData.slice(0, 6) : []);
        setWorkflows(workflowData.slice ? workflowData.slice(0, 6) : []);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="techxen-landing">
      <Header1 />
      <Home plans={plans} courses={courses} workflows={workflows} loading={loading} />
      <Footer1 />
    </div>
  );
};

export default TechxenLanding;

