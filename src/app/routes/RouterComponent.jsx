import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";
import Home from "../pages/Home";

// About pages
import AboutUs from "../pages/About/AboutUs";
import VisionMission from "../pages/About/VisionMission";
import Leadership from "../pages/About/Leadership";
import Awards from "../pages/About/Awards";
import MandatoryDisclosure from "../pages/About/MandatoryDisclosure";
import Testimonials from "../pages/About/Testimonials";

// Academics
import AcademicsOverview from "../pages/Academics/AcademicsOverview";
import TeachingStyle from "../pages/Academics/TeachingStyle";
import ExperiencedFaculty from "../pages/Academics/ExperiencedFaculty";
import AcademicsFAQ from "../pages/Academics/AcademicsFAQ";
import Newsletter from "../pages/Academics/Newsletter";
import AcademicDoc from "../pages/Academics/AcademicDoc";
import Training from "../pages/Academics/Training";
import SeniorSecondary from "../pages/Academics/SeniorSecondary";
import CurriculumSupportProgram from "../pages/Academics/CurriculumSupportProgram";

// Beyond Academics
import BeyondSports from "../pages/BeyondAcademics/BeyondSports";
import ClubsActivities from "../pages/BeyondAcademics/ClubsActivities";
import MessMenu from "../pages/BeyondAcademics/MessMenu";
import TransportSOP from "../pages/BeyondAcademics/TransportSOP";
import StudentCorner from "../pages/BeyondAcademics/StudentCorner";
import StudentCouncil from "../pages/BeyondAcademics/StudentCouncil";

// Admissions
import AdmissionsOverview from "../pages/Admissions/AdmissionsOverview";
import AdmissionsProcess from "../pages/Admissions/AdmissionsProcess";
import AgeCriteria from "../pages/Admissions/AgeCriteria";
import AdmissionsSOP from "../pages/Admissions/AdmissionsSOP";
import AdmissionsFAQ from "../pages/Admissions/AdmissionsFAQ";

// Gallery
import GalleryPhotos from "../pages/Gallery/GalleryPhotos";
import KindergartenKaleidoscope from "../pages/Gallery/KindergartenKaleidoscope";
import GalleryVideos from "../pages/Gallery/GalleryVideos";

// Contact
import ContactForAdmission from "../pages/Contact/ContactForAdmission";
import Careers from "../pages/Contact/Careers";

//Common Form
import CommonForm from "../pages/CommonForm/CommonForm";

const AppRoutes = () => (
  <Routes>
    <Route
      element={
        // <ProtectedRoute>
        <MainLayout />
        // </ProtectedRoute>
      }
    >
      <Route path="/home" element={<Home />} />

      {/* About */}
      <Route path="/about/about-us" element={<AboutUs />} />
      <Route path="/about/vision-mission" element={<VisionMission />} />
      <Route path="/about/leadership" element={<Leadership />} />
      <Route path="/about/awards" element={<Awards />} />
      <Route path="/about/mandatory-disclosure" element={<MandatoryDisclosure />} />
      <Route path="/about/testimonials" element={<Testimonials />} />

      {/* Academics */}
      <Route path="/academics/overview" element={<AcademicsOverview />} />
      <Route path="/academics/teaching-style" element={<TeachingStyle />} />
      <Route path="/academics/experienced-faculty" element={<ExperiencedFaculty />} />
      <Route path="/academics/faq" element={<AcademicsFAQ />} />
      <Route path="/academics/newsletter" element={<Newsletter />} />
      <Route path="/academics/academic-doc" element={<AcademicDoc />} />
      <Route path="/academics/training" element={<Training />} />
      <Route path="/academics/senior-secondary" element={<SeniorSecondary />} />
      <Route path="/academics/curriculum-support-program" element={<CurriculumSupportProgram />} />

      {/* Beyond Academics */}
      <Route path="/beyond-academics/sports" element={<BeyondSports />} />
      <Route path="/beyond-academics/clubs-activities" element={<ClubsActivities />} />
      <Route path="/beyond-academics/mess-menu" element={<MessMenu />} />
      <Route path="/beyond-academics/transport-sop" element={<TransportSOP />} />
      <Route path="/beyond-academics/student-corner" element={<StudentCorner />} />
      <Route path="/beyond-academics/student-council" element={<StudentCouncil />} />

      {/* Admissions */}
      <Route path="/admissions/overview" element={<AdmissionsOverview />} />
      <Route path="/admissions/process" element={<AdmissionsProcess />} />
      <Route path="/admissions/age-criteria" element={<AgeCriteria />} />
      <Route path="/admissions/sop" element={<AdmissionsSOP />} />
      <Route path="/admissions/faq" element={<AdmissionsFAQ />} />

      {/* Gallery */}
      <Route path="/gallery/photos" element={<GalleryPhotos />} />
      <Route path="/gallery/kindergarten-kaleidoscope" element={<KindergartenKaleidoscope />} />
      <Route path="/gallery/videos" element={<GalleryVideos />} />

      {/* Contact */}
      <Route path="/contact/admission" element={<ContactForAdmission />} />
      <Route path="/contact/careers" element={<Careers />} />

      {/* Common Form */}
      <Route path="/common-form/:typeId" element={<CommonForm />} />
      <Route path="/common-form" element={<CommonForm />} />

    </Route>
  </Routes>
);

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
