// MainLayout.jsx
import { cloneElement, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.scss";
import { Grid } from "antd";

import Logo from "../../assets/auth-logo.webp";
import DummyUser from "../../assets/SampleUser.jpg";
import NavbarIcon from "../../assets/icons/navbarIcons/NavbarIcon";
import LogoutIcon from "../../assets/icons/navbarIcons/LogoutIcon";

import {
  CalendarOutlined,
  InfoCircleOutlined,
  ReadOutlined,
  TrophyOutlined,
  FormOutlined,
  PictureOutlined,
  PhoneOutlined,
  CloseOutlined,
  CaretDownOutlined,

  // child icons
  BookOutlined,
  FlagOutlined,
  TeamOutlined,
  FileTextOutlined,
  CommentOutlined,
  BulbOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  FileDoneOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  AppstoreOutlined,
  CoffeeOutlined,
  SolutionOutlined,
  CrownOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  PhoneFilled,
  IdcardOutlined,
} from "@ant-design/icons";

import CustomModal from "../CustomModal/CustomModal";

const { useBreakpoint } = Grid;
const MENUS = [
  { key: "home", text: "Home", icon: <CalendarOutlined />, path: "/home" },

  {
    key: "about",
    text: "About Us",
    icon: <InfoCircleOutlined />,
    children: [
      {
        key: "about.about-us",
        text: "About Us",
        path: "/about/about-us",
        icon: <InfoCircleOutlined />,
      },
      {
        key: "about.vision-mission",
        text: "Vision & Mission",
        path: "/about/vision-mission",
        icon: <FlagOutlined />,
      },
      {
        key: "about.leadership",
        text: "Meridian Leadership",
        path: "/about/leadership",
        icon: <TeamOutlined />,
      },
      {
        key: "about.awards",
        text: "Awards & Accolades",
        path: "/about/awards",
        icon: <TrophyOutlined />,
      },
      {
        key: "about.mandatory",
        text: "Mandatory Public Disclosure",
        path: "/about/mandatory-disclosure",
        icon: <FileTextOutlined />,
      },
      {
        key: "about.testimonials",
        text: "Testimonials",
        path: "/about/testimonials",
        icon: <CommentOutlined />,
      },
    ],
  },

  {
    key: "academics",
    text: "Academics",
    icon: <ReadOutlined />,
    children: [
      {
        key: "academics.overview",
        text: "Academics",
        path: "/academics/overview",
        icon: <BookOutlined />,
      },
      {
        key: "academics.teaching-style",
        text: "Teaching Style",
        path: "/academics/teaching-style",
        icon: <BulbOutlined />,
      },
      {
        key: "academics.faculty",
        text: "Experienced Faculty",
        path: "/academics/experienced-faculty",
        icon: <UserOutlined />,
      },
      {
        key: "academics.faq",
        text: "Academics FAQ",
        path: "/academics/faq",
        icon: <QuestionCircleOutlined />,
      },
      {
        key: "academics.newsletter",
        text: "Newsletter",
        path: "/academics/newsletter",
        icon: <MailOutlined />,
      },
      {
        key: "academics.doc",
        text: "Academic Doc",
        path: "/academics/academic-doc",
        icon: <FileDoneOutlined />,
      },
      {
        key: "academics.training",
        text: "Training",
        path: "/academics/training",
        icon: <SolutionOutlined />,
      },
      {
        key: "academics.senior-secondary",
        text: "Senior Secondary",
        path: "/academics/senior-secondary",
        icon: <CrownOutlined />,
      },
      {
        key: "academics.csp",
        text: "Curriculum Support Program",
        path: "/academics/curriculum-support-program",
        icon: <SafetyCertificateOutlined />,
      },
    ],
  },

  {
    key: "beyond",
    text: "Beyond Academics",
    icon: <TrophyOutlined />,
    children: [
      {
        key: "beyond.sports",
        text: "Sports",
        path: "/beyond-academics/sports",
        icon: <TrophyOutlined />,
      },
      {
        key: "beyond.clubs",
        text: "Clubs & Activities",
        path: "/beyond-academics/clubs-activities",
        icon: <AppstoreOutlined />,
      },
      {
        key: "beyond.mess-menu",
        text: "Mess Menu",
        path: "/beyond-academics/mess-menu",
        icon: <CoffeeOutlined />,
      },
      {
        key: "beyond.transport-sop",
        text: "Transport SOP",
        path: "/beyond-academics/transport-sop",
        icon: <CarOutlined />,
      },
      {
        key: "beyond.student-corner",
        text: "Student Corner",
        path: "/beyond-academics/student-corner",
        icon: <UserOutlined />,
      },
      {
        key: "beyond.student-council",
        text: "Student Council",
        path: "/beyond-academics/student-council",
        icon: <TeamOutlined />,
      },
    ],
  },

  {
    key: "admissions",
    text: "Admissions",
    icon: <FormOutlined />,
    children: [
      {
        key: "admissions.overview",
        text: "Admissions",
        path: "/admissions/overview",
        icon: <FormOutlined />,
      },
      {
        key: "admissions.process",
        text: "The Process",
        path: "/admissions/process",
        icon: <SolutionOutlined />,
      },
      {
        key: "admissions.age-criteria",
        text: "Age Criteria",
        path: "/admissions/age-criteria",
        icon: <IdcardOutlined />,
      },
      {
        key: "admissions.sop",
        text: "Admissions SOP",
        path: "/admissions/sop",
        icon: <FileTextOutlined />,
      },
      {
        key: "admissions.faq",
        text: "Admission FAQs",
        path: "/admissions/faq",
        icon: <QuestionCircleOutlined />,
      },
    ],
  },

  // {
  //   key: "gallery",
  //   text: "Gallery",
  //   icon: <PictureOutlined />,
  //   children: [
  //     {
  //       key: "gallery.photos",
  //       text: "Photo Gallery",
  //       path: "/gallery/photos",
  //       icon: <CameraOutlined />,
  //     },
  //     {
  //       key: "gallery.kindergarten",
  //       text: "Kindergarten Kaleidoscope",
  //       path: "/gallery/kindergarten-kaleidoscope",
  //       icon: <PictureOutlined />,
  //     },
  //     {
  //       key: "gallery.videos",
  //       text: "Video Gallery",
  //       path: "/gallery/videos",
  //       icon: <VideoCameraOutlined />,
  //     },
  //   ],
  // },

  // {
  //   key: "contact",
  //   text: "Contact Us",
  //   icon: <PhoneOutlined />,
  //   children: [
  //     {
  //       key: "contact.admission",
  //       text: "For Admission",
  //       path: "/contact/admission",
  //       icon: <PhoneFilled />,
  //     },
  //     {
  //       key: "contact.careers",
  //       text: "Careers",
  //       path: "/contact/careers",
  //       icon: <TeamOutlined />,
  //     },
  //   ],
  // },
];

const MainLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openKey, setOpenKey] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const screens = useBreakpoint();
  const isPhone = !screens.md;
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const menuItems = useMemo(() => MENUS, []);
  const openMobileNav = () => setMobileNavOpen(true);
  const closeMobileNav = () => setMobileNavOpen(false);

  useEffect(() => {
    const parent = menuItems.find((m) =>
      m.children?.some((c) => location.pathname.startsWith(c.path))
    );
    if (parent) setOpenKey(parent.key);
  }, [location.pathname, menuItems]);

  useEffect(() => {
    if (!isPhone) return;
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen, isPhone]);

  const confirmLogout = () => {
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate("/");
  };

  const toggleOpen = (key) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const handleParentClick = (item) => {
    const hasChildren = !!item.children?.length;
    if (hasChildren) {
      toggleOpen(item.key);
      return;
    }
    if (item.path) {
      navigate(item.path);
      if (isPhone) closeMobileNav();
    }
  };

  const handleChildClick = (path) => {
    navigate(path);
    if (isPhone) closeMobileNav();
  };

  const renderMenuList = () => (
    <ul className="sidebar1_center_menu">
      {menuItems.map((item) => {
        const hasChildren = !!item.children?.length;

        const isChildActive = item.children?.some((c) =>
          location.pathname.startsWith(c.path)
        );

        const isActive =
          (item.path && location.pathname.startsWith(item.path)) ||
          isChildActive;

        const isOpen = openKey === item.key;

        const coloredIcon = cloneElement(item.icon, {
          style: {
            color: isActive ? "#ffffff" : "#919CB4",
            fontSize: "18px",
            fontWeight: 700,
          },
        });

        return (
          <li
            key={item.key}
            className={`sidebar1_center_menu_row ${isActive ? "active" : ""}`}
          >
            <button
              type="button"
              className={`sidebar1_center_menu_btn ${isActive ? "is-active" : ""
                }`}
              onClick={() => handleParentClick(item)}
              aria-expanded={hasChildren ? isOpen : undefined}
            >
              <span className="sidebar1_center_menu_icon">{coloredIcon}</span>
              <span className="sidebar1_center_menu_label">{item.text}</span>
              {hasChildren && (
                <span className={`submenu_caret ${isOpen ? "open" : ""}`}>
                  <CaretDownOutlined />
                </span>
              )}
            </button>

            {hasChildren && isOpen && (
              <ul className="sidebar1_submenu">
                {item.children.map((child) => {
                  const childActive = location.pathname.startsWith(child.path);
                  return (
                    <li key={child.key} className="sidebar1_submenu_row">
                      <button
                        type="button"
                        className={`sidebar1_submenu_btn ${childActive ? "is-active" : ""
                          }`}
                        onClick={() => handleChildClick(child.path)}
                      >
                        {child.icon && (
                          <span className="sidebar1_submenu_icon">
                            {cloneElement(child.icon, {
                              style: { fontSize: "16px" },
                            })}
                          </span>
                        )}
                        <span>{child.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="mainlayout">
      {/* ===================== Desktop Sidebar ===================== */}
      {!isPhone && (
        <aside className="sidebar1" aria-label="Main sidebar">
          <div className="sidebar1_top">
            <h1>Main Menu</h1>
          </div>

          <nav className="sidebar1_center" aria-label="Main">
            {renderMenuList()}
          </nav>

          <div className="sidebar1_bottom">
            <button
              type="button"
              className="sidebar1_logout_btn"
              onClick={() => setShowLogoutModal(true)}
            >
              <span className="sidebar1_logout_text">Logout</span>
              <span className="sidebar1_logout_icon">
                <LogoutIcon />
              </span>
            </button>
          </div>
        </aside>
      )}

      {/* ===================== Mobile Drawer Sidebar ===================== */}
      {isPhone && (
        <>
          <div
            className={`mobile-sidebar-backdrop ${mobileNavOpen ? "open" : ""}`}
            onClick={closeMobileNav}
          />

          <aside
            className={`sidebar1 mobile-drawer ${mobileNavOpen ? "open" : ""}`}
            aria-label="Mobile sidebar"
          >
            <div className="sidebar1_top">
              <h1>Main Menu</h1>
              <button
                className="sidebar1_toggle"
                onClick={closeMobileNav}
                type="button"
                aria-label="Close menu"
              >
                <CloseOutlined />
              </button>
            </div>

            <nav className="sidebar1_center" aria-label="Main">
              {renderMenuList()}
            </nav>

            <div className="sidebar1_bottom">
              <button
                type="button"
                className="sidebar1_logout_btn"
                onClick={() => setShowLogoutModal(true)}
              >
                <span className="sidebar1_logout_text">Logout</span>
                <span className="sidebar1_logout_icon">
                  <LogoutIcon />
                </span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ===================== Right Pane ===================== */}
      <div className="mainlayout_right">
        <header className="mainlayout_header">
          <div className="header_left">
            {isPhone && (
              <button
                className="header_navbtn"
                type="button"
                aria-label="Open menu"
                onClick={openMobileNav}
              >
                <NavbarIcon />
              </button>
            )}

            <div className="brand">
              <img src={Logo} alt="Logo" className="brand_logo" />
            </div>
          </div>

          <div className="header_right">
            <button className="user_btn" type="button">
              <img src={DummyUser} alt="User Avatar" className="user_avatar" />
              <div className="user_meta">
                <span className="user_name">
                  {userData?.userName || "Admin"}
                </span>
              </div>
            </button>

            {isPhone && (
              <button
                className="icon_btn logout_btn_mobile"
                aria-label="Logout"
                type="button"
                onClick={() => setShowLogoutModal(true)}
                title="Logout"
              >
                <LogoutIcon />
              </button>
            )}
          </div>
        </header>

        <main className="mainlayout_content">
          <Outlet />
        </main>
      </div>

      {/* ===================== Logout Modal ===================== */}
      <CustomModal
        open={showLogoutModal}
        title="Confirm Logout"
        onClose={() => setShowLogoutModal(false)}
        showPrimary
        showDanger
        primaryText="Logout"
        dangerText="Cancel"
        onPrimary={confirmLogout}
        onDanger={() => setShowLogoutModal(false)}
        primaryProps={{ variant: "danger" }}
        maskClosable={false}
        centered
      >
        <p style={{ margin: 0 }}>
          Are you sure you want to logout? You’ll need to sign in again to
          continue.
        </p>
      </CustomModal>
    </div>
  );
};

export default MainLayout;
