import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { elearningService, authService } from "../../config";
import { Course, CourseVideo, LearningDashboard } from "../../services/elearningService";
import { 
  BookOpen, 
  Search, 
  Rocket, 
  Flame, 
  Target, 
  Trophy, 
  CheckCircle, 
  Clock, 
  ShoppingCart, 
  Star, 
  User as UserIcon,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Search as SearchIcon,
  ArrowRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar
} from "lucide-react";

// Mock data for the streaks and mentors
const MENTORS = [
  { id: 1, name: "Advance Framer", author: "Ethan Carter", price: "$122", icon: "💎", status: "completed" },
  { id: 2, name: "Cyber Security", author: "Mark Boston", price: "$122", icon: "🌐", status: "completed" },
  { id: 3, name: "Machine Learning", author: "Ethan Carter", price: "$122", icon: "🤖", status: "pending" },
  { id: 4, name: "Physics Primer", author: "Ethan Carter", price: "$122", icon: "⚛️", status: "pending" },
];

const WEEK_DAYS = [
  { day: "Mon", date: "28", active: true },
  { day: "Tue", date: "29", active: true },
  { day: "Wed", date: "30", active: true },
  { day: "Thu", date: "31", active: false },
  { day: "Fri", date: "01", active: false },
  { day: "Sat", date: "02", active: false },
];

interface HomeBannerItem extends CourseVideo {
  courseId: string | number;
  courseTitle: string;
  courseLevel?: Course["level"];
  coursePrice?: Course["price"];
  courseThumbnail?: string | null;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  updatedAt?: string | null;
}

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bannerVideos, setBannerVideos] = useState<HomeBannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [learningDashboard, setLearningDashboard] = useState<LearningDashboard | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const localUser = authService.getUser();
        setUserProfile(localUser);

        const [data, dashboard, profile] = await Promise.all([
          elearningService.getClientCourses({ limit: 12 }),
          authService.isAuthenticated() ? elearningService.getLearningDashboard().catch(() => null) : Promise.resolve(null),
          authService.isAuthenticated() ? authService.getProfile().catch(() => null) : Promise.resolve(null),
        ]);
        const courseItems = data.data || [];
        setCourses(courseItems);
        setLearningDashboard(dashboard);

        const bannerGroups = await Promise.all(
          courseItems.map(async (course) => {
            if (!course.id) return [];

            const videos = await elearningService.getClientCourseVideos(course.id);

            return videos
              .filter((video) => Boolean(video.img_banner || video.imgBanner))
              .map((video) => ({
                ...video,
                img_banner: video.img_banner || video.imgBanner || null,
                courseId: course.id as string | number,
                courseTitle: course.title,
                courseLevel: course.level,
                coursePrice: course.price,
                courseThumbnail: course.thumbnail || course.thumbnail_url || null,
              }));
          })
        );

        setBannerVideos(bannerGroups.flat());

        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const homeItems = useMemo<HomeBannerItem[]>(
    () =>
      bannerVideos.length > 0
        ? bannerVideos
        : courses.map((course) => ({
            course_id: Number(course.id) || 0,
            courseId: course.id || "",
            courseTitle: course.title,
            title: course.title,
            url: "",
            img_banner: course.thumbnail || course.thumbnail_url || null,
            courseThumbnail: course.thumbnail || course.thumbnail_url || null,
            courseLevel: course.level,
            coursePrice: course.price,
          })),
    [bannerVideos, courses]
  );

  const continueLearning = useMemo<HomeBannerItem[]>(
    () => {
      if (learningDashboard?.continueLearning?.length) {
        return learningDashboard.continueLearning.map((item) => ({
          course_id: Number(item.courseId) || 0,
          courseId: item.courseId,
          courseTitle: item.category || item.title,
          title: item.title,
          url: "",
          img_banner: item.thumbnail || null,
          courseThumbnail: item.thumbnail || null,
          coursePrice: item.price,
          progress: item.progress,
          totalLessons: item.totalLessons,
          completedLessons: item.completedLessons,
          updatedAt: item.updatedAt || item.lastWatchedAt || null,
        }));
      }

      return homeItems;
    },
    [homeItems, learningDashboard]
  );

  const recommended = useMemo<HomeBannerItem[]>(
    () => {
      if (learningDashboard?.recommendedCourses?.length) {
        return learningDashboard.recommendedCourses.map((item) => ({
          course_id: Number(item.courseId) || 0,
          courseId: item.courseId,
          courseTitle: item.category || item.title,
          title: item.title,
          url: "",
          img_banner: item.thumbnail || null,
          courseThumbnail: item.thumbnail || null,
          coursePrice: item.price,
          progress: item.progress,
          totalLessons: item.totalLessons,
          completedLessons: item.completedLessons,
          updatedAt: item.updatedAt || item.lastWatchedAt || null,
        }));
      }

      return homeItems;
    },
    [homeItems, learningDashboard]
  );

  const recentEnrolled = useMemo<HomeBannerItem[]>(
    () => {
      if (learningDashboard?.recentEnrolled?.length) {
        return learningDashboard.recentEnrolled.map((item) => ({
          course_id: Number(item.courseId) || 0,
          courseId: item.courseId,
          courseTitle: item.category || item.title,
          title: item.title,
          url: "",
          img_banner: item.thumbnail || null,
          courseThumbnail: item.thumbnail || null,
          coursePrice: item.price,
          progress: item.progress,
          totalLessons: item.totalLessons,
          completedLessons: item.completedLessons,
          updatedAt: item.updatedAt || item.lastWatchedAt || null,
        }));
      }

      return homeItems;
    },
    [homeItems, learningDashboard]
  );

  const learningStats = learningDashboard?.stats || {
    allowedCourses: 0,
    registeredCourses: 0,
    inProgressCourses: 0,
    completedCourses: 0,
    progressRate: 0,
    averageProgress: 0,
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Left */}
      <aside className="w-64 bg-[#001D1E] text-white flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center font-bold text-xl">3H</div>
          <span className="font-bold text-xl tracking-tight">Dashboard</span>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] text-teal-700/60 font-bold uppercase tracking-widest mb-4">Overview</p>
          <div className="space-y-1">
            <Link to="/" className="flex items-center justify-between bg-teal-500/10 text-teal-400 px-4 py-3 rounded-2xl group transition-all">
              <div className="flex items-center gap-3 font-medium">
                <LayoutDashboard size={18} />
                <span>My Overview</span>
              </div>
              <span className="bg-teal-500/20 px-2 py-0.5 rounded-full text-[10px] text-teal-400">242</span>
            </Link>
            <Link to="/performance" className="flex items-center gap-3 text-white/50 hover:text-white px-4 py-3 transition-all rounded-2xl">
              <Target size={18} />
              <span>My Performance</span>
            </Link>
            <Link to="/insights" className="flex items-center gap-3 text-white/50 hover:text-white px-4 py-3 transition-all rounded-2xl">
              <Sparkles size={18} />
              <span>All Insights</span>
            </Link>
          </div>

          <p className="text-[10px] text-teal-700/60 font-bold uppercase tracking-widest mt-8 mb-4">Classroom Insights</p>
          <div className="space-y-1">
            <Link to="/my-courses" className="flex items-center gap-3 text-white/50 hover:text-white px-4 py-3 transition-all rounded-2xl">
              <GraduationCap size={18} />
              <span>My Courses</span>
            </Link>
            <Link to="/learning-overview" className="flex items-center gap-3 text-white/50 hover:text-white px-4 py-3 transition-all rounded-2xl">
              <BookOpen size={18} />
              <span>Learning Overview</span>
            </Link>
          </div>
        </nav>

        {/* Premium Upgrade Card */}
        <div className="mt-auto pt-10">
          <div className="relative bg-[#002B2C] border border-white/[0.03] p-5 rounded-3xl overflow-hidden">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-500/10 rounded-full blur-2xl" />
            <div className="bg-[#003839] w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-black/20">
              <Rocket className="text-teal-400" size={24} />
            </div>
            <h4 className="font-bold text-base mb-2">Get Premium Now!</h4>
            <p className="text-xs text-white/40 leading-relaxed mb-4">Reach our special feature by subscribe our plan.</p>
            <button className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-95">
              <span>Upgrade Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Dashboard</span>
            <span className="text-slate-200">/</span>
            <span>Overview</span>
            <span className="text-slate-200">/</span>
            <span className="text-slate-900 font-bold flex items-center gap-1.5">
              My Overview <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">242</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Global search" 
                className="bg-slate-100/50 border-none rounded-2xl pl-10 pr-12 py-2 text-sm w-64 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] text-slate-400 font-bold shadow-sm">
                ⌘ F
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Hey, Welcome!</p>
                <p className="text-sm font-bold text-slate-900 leading-none">{userProfile?.name || "Surendar V"}</p>
              </div>
              <img 
                src="https://avatar.iran.liara.run/public/boy?username=surendar" 
                alt="Profile" 
                className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="p-8 flex-1 overflow-y-auto overflow-x-hidden space-y-10 custom-scrollbar">
          
          {/* Section: Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="text-slate-400" size={20} />
                <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {continueLearning.length}
                </span>
              </div>
              <Link to="/my-courses" className="text-xs font-bold text-slate-400 hover:text-teal-600 flex items-center gap-1 transition-all">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueLearning.map((item, index) => (
                <div key={item.id || `${item.courseId}-continue-${index}`} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                        <div className="w-14 h-14 bg-blue-50 rounded-[1.25rem] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {item.img_banner ? <img src={item.img_banner} className="w-full h-full object-cover rounded-[1.25rem]" alt={item.title} /> : "🎨"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">{item.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">{item.courseTitle}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
                  </div>

                  <div className="space-y-3 mb-6">
                     <div className="flex items-center justify-between text-[11px] font-bold">
                        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden mr-3">
                           <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, Number(item.progress || 0)))}%` }} />
                        </div>
                        <span className="text-slate-900 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">{Math.round(Number(item.progress || 0))}%</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5"><Calendar size={12} /> {Number(item.completedLessons || 0)}/{Number(item.totalLessons || 0)} Lessons</div>
                    <div className="flex items-center gap-1.5"><Clock size={12} /> {Math.max(Number(item.totalLessons || 0) - Number(item.completedLessons || 0), 0)} videos left</div>
                  </div>
                  
                  <div className="mt-5">
                    <Link to={`/courses/${item.courseId}`} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-2xl transition-all border border-teal-100 shadow-sm active:scale-95">
                      Resume course <ChevronRight size={14} className="mt-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Recommended Courses */}
          <section>
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Rocket className="text-slate-400" size={20} />
                <h2 className="text-lg font-bold text-slate-900">Recommended Courses</h2>
                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {recommended.length}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search courses" className="bg-white border border-slate-100 rounded-xl pl-9 pr-10 py-1.5 text-xs w-48 outline-none" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-300 font-bold border border-slate-100 rounded px-1 flex items-center leading-none h-4">⌘ F</span>
                </div>
                <Link to="/landing-courses" className="text-xs font-bold text-slate-400 hover:text-teal-600 flex items-center gap-1 transition-all">
                  View All <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {recommended.map((item, index) => (
                  <div key={item.id || `${item.courseId}-recommended-${index}`} className="bg-white p-3 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all h-full flex flex-col group">
                     <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 bg-slate-100">
                        <div className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">New</div>
                        <img src={item.img_banner || item.courseThumbnail || undefined} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                        <Link to={`/courses/${item.courseId}`} className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                           <span className="text-white text-xs font-bold ring-1 ring-white/30 rounded-full px-3 py-1 backdrop-blur-sm">View Details</span>
                        </Link>
                     </div>
                     <div className="px-3 pb-3 flex-1 flex flex-col">
                        <h4 className="font-bold text-sm text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">{item.title}</h4>
                        <div className="flex items-center justify-between text-xs mb-5">
                           <p className="text-slate-400 font-medium line-clamp-1">{item.courseTitle}</p>
                           <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100/50">
                              <Star size={10} fill="currentColor" />
                              <span className="font-bold text-[10px]">4.8 <span className="text-slate-300 font-medium">(1023)</span></span>
                           </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                           <span className="text-teal-600 font-extrabold text-lg">{item.coursePrice || "0"}đ</span>
                           <Link to={`/courses/${item.courseId}`} className="bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-600 font-bold text-xs px-5 py-2 rounded-2xl transition-all shadow-sm active:scale-95">Chi tiết</Link>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </section>

          {/* Section: Recent Enrolled Course */}
          <section className="pb-10 overflow-hidden">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <Sparkles className="text-slate-400" size={20} />
                 Recent Enrolled Course <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-bold">{recentEnrolled.length}</span>
               </h2>
               <Link to="/my-courses" className="text-xs font-bold text-slate-400 hover:text-teal-600 flex items-center gap-1 transition-all">
                View All <ChevronRight size={14} />
              </Link>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recentEnrolled.map((item, index) => (
                   <div key={item.id || `${item.courseId}-recent-${index}`} className="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 aspect-square bg-slate-100 rounded-[2.25rem] overflow-hidden shrink-0 shadow-lg shadow-slate-100">
                         <img src={item.img_banner || item.courseThumbnail || undefined} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                         <div>
                           <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors">{item.title}</h4>
                           <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-6">
                              <span>{item.courseTitle}</span>
                              <div className="flex items-center gap-1 text-amber-500">
                                 <Star size={12} fill="currentColor" />
                                 <span className="font-bold text-slate-700">4.8 <span className="text-slate-400 font-medium">(1023)</span></span>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-4 mb-6">
                              <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, Number(item.progress || 0)))}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-900 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">{Math.round(Number(item.progress || 0))}%</span>
                           </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-50">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               <Calendar size={12} className="text-teal-500" />
                               <span>{Number(item.completedLessons || 0)}/{Number(item.totalLessons || 0)} Lessons</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               <Clock size={12} className="text-teal-500" />
                               <span>{Math.max(Number(item.totalLessons || 0) - Number(item.completedLessons || 0), 0)} videos left</span>
                            </div>
                         </div>

                         <div className="pt-4 flex items-center justify-end">
                            <Link to={`/courses/${item.courseId}`} className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 group/btn">
                               Resume course <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </section>

        </div>
      </main>

      {/* Sidebar - Right */}
      <aside className="w-80 bg-white border-l border-slate-100 flex flex-col p-8 overflow-y-auto hidden xl:flex">
         <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">User Profile</h3>
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
         </div>

         {/* Profile Card */}
         <div className="text-center mb-10">
            <div className="inline-block relative mb-4">
               <img src="https://avatar.iran.liara.run/public/boy?username=surendar" className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl ring-2 ring-teal-500/20" alt="Avatar" />
               <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center font-bold text-[10px]">
                  Lv5
               </div>
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 mb-1 leading-none">{userProfile?.name || "Surendar V"}</h4>
            <p className="text-xs text-slate-400 font-medium mb-6 uppercase tracking-wider">UI/UX Designer & Developer</p>
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full border border-amber-100">
               <Trophy size={14} />
               <span className="font-extrabold text-xs">{userProfile?.rank?.name || learningDashboard?.account?.rank?.name || "Member"} <span className="font-medium text-amber-400">Rank</span></span>
            </div>
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-3 gap-2 mb-10">
            <div className="bg-orange-50/50 p-2 rounded-2xl border border-orange-100/30 text-center">
               <Flame className="text-orange-500 mx-auto mb-1" size={16} />
               <p className="text-[14px] font-extrabold text-slate-900 leading-none">{learningStats.registeredCourses}</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-1">Registered</p>
            </div>
            <div className="bg-blue-50/50 p-2 rounded-2xl border border-blue-100/30 text-center">
              <Target className="text-blue-500 mx-auto mb-1" size={16} />
               <p className="text-[14px] font-extrabold text-slate-900 leading-none">{learningStats.averageProgress}%</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-1">Avg Progress</p>
            </div>
            <div className="bg-amber-50/50 p-2 rounded-2xl border border-amber-100/30 text-center">
               <Trophy className="text-amber-500 mx-auto mb-1" size={16} />
               <p className="text-[14px] font-extrabold text-slate-900 leading-none">{learningStats.completedCourses}</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-1">Completed</p>
            </div>
         </div>

         {/* Weekly Streak */}
         <div className="mb-10">
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">Weekly Streak</h4>
              <button className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 transition-all">
                <Calendar size={12} className="text-teal-500" />
                May 2025
              </button>
           </div>
           
           <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-tighter">4/4 Weeks</span>
                 <div className="flex gap-2">
                    <button className="w-5 h-5 text-slate-400 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:text-teal-500 transition-all"><ChevronLeft size={12} /></button>
                    <button className="w-5 h-5 text-slate-400 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:text-teal-500 transition-all"><ChevronRight size={12} /></button>
                 </div>
              </div>
              <div className="flex justify-between">
                 {WEEK_DAYS.map((d, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 p-2 rounded-[1rem] min-w-[32px] transition-all ${d.active ? 'bg-teal-500 shadow-lg shadow-teal-500/20' : 'bg-transparent text-slate-300'}`}>
                       <span className={`text-[8px] font-bold uppercase transition-all ${d.active ? 'text-white/70' : 'text-slate-400'}`}>{d.day}</span>
                       <span className={`text-xs font-black transition-all ${d.active ? 'text-white' : 'text-slate-900'}`}>{d.date}</span>
                    </div>
                 ))}
              </div>
           </div>
         </div>

         {/* Summary Stats */}
         <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-orange-50 p-4 rounded-[2rem] border border-orange-100 space-y-2 group hover:shadow-lg transition-all">
               <div className="p-2 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform"><BookOpen size={16} className="text-orange-500" /></div>
               <p className="text-lg font-black text-slate-900 leading-none">{learningStats.inProgressCourses} Courses</p>
               <p className="text-[10px] font-bold text-orange-600/70 uppercase leading-none">In Progress</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-[2rem] border border-teal-100 space-y-2 group hover:shadow-lg transition-all">
               <div className="p-2 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform"><CheckCircle size={16} className="text-teal-500" /></div>
               <p className="text-lg font-black text-slate-900 leading-none">{learningStats.completedCourses} Courses</p>
               <p className="text-[10px] font-bold text-teal-600/70 uppercase leading-none">Completed</p>
            </div>
         </div>

         {/* Mentors / Recommended Cards List */}
         <div className="mb-6 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">Your Mentors</h4>
              <button className="text-[10px] font-bold text-slate-400 hover:text-teal-600 transition-all">Show More</button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 pb-4 custom-scrollbar">
               {MENTORS.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all group cursor-pointer shadow-sm active:scale-95">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-xl shadow-inner group-hover:scale-110 transition-transform">{m.icon}</div>
                        <div>
                           <h5 className="text-[13px] font-extrabold text-slate-900 mb-0.5 leading-none group-hover:text-teal-600 transition-colors">{m.name}</h5>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{m.author}</p>
                           <p className="text-[11px] font-black text-teal-600 mt-1">{m.price}</p>
                        </div>
                     </div>
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${m.status === 'completed' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-100 text-slate-300 border border-slate-200'}`}>
                        <CheckCircle size={12} fill={m.status === 'completed' ? 'currentColor' : 'none'} />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Bottom Action */}
         <div className="mt-auto">
            <button className="w-full bg-[#001D1E] hover:bg-teal-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 group">
              <ShoppingCart size={16} className="group-hover:translate-x-0.5 transition-transform" />
              <span>Save Courses</span>
            </button>
         </div>

      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Home;
