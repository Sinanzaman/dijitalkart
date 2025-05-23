import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import "../CSS/CardDesign.css";
import { uploadImageAndReplaceOld } from "../firebase";
import MyDesigns from "../components/MyDesigns";
import CardForm from "../components/CardForm";
import { useUser } from "../contexts/UserContext";

const CardDesign = () => {
  const { cardid } = useUser();
  const [profileImage, setProfileImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    imageUrl: "",
    projectUrl: "",
  });
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8080/api/cards";

  useEffect(() => {
    const fetchCard = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.profileImageUrl || "");
          setBackgroundImage(data.backgroundImageUrl || "");
          setFullName(data.fullName || "");
          setJobTitle(data.jobTitle || "");
          setAbout(data.about || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setLinkedin(data.linkedinUrl || "");
          setGithub(data.githubUrl || "");
          setWebsite(data.websiteUrl || "");
          setSkills(data.skills || []);
          setSelectedDesignId(data.selectedDesignId || null);
          setProjects(data.projects || []); // backend tarafında projects varsa
        } else {
          console.error("Kullanıcı kartı getirilemedi.");
        }
      } catch (error) {
        console.error("Kart getirme hatası:", error);
      }
    };

    fetchCard();
  }, []);

  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addProject = () => {
    if (newProject.title.trim() === "" || newProject.projectUrl.trim() === "") {
      alert("Proje başlığı ve linki zorunludur.");
      return;
    }
    setProjects([...projects, newProject]);
    setNewProject({ title: "", description: "", imageUrl: "", projectUrl: "" });
    setShowProjectForm(false);
  };

  const removeProject = (indexToRemove) => {
    if (window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) {
      setProjects(projects.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.userId ?? decoded.sub;

    let uploadedProfileUrl = profileImage;
    let uploadedBackgroundUrl = backgroundImage;

    try {
      // Seçili dosya varsa yükle
      if (profileFile) {
        uploadedProfileUrl = await uploadImageAndReplaceOld(
          userId,
          profileFile,
          "profilePhoto"
        );
      }
      if (backgroundFile) {
        uploadedBackgroundUrl = await uploadImageAndReplaceOld(
          userId,
          backgroundFile,
          "backgroundPhoto"
        );
      }
    } catch (uploadErr) {
      setMessage("Resim yüklenirken hata oluştu: " + uploadErr.message);
      return;
    }

    const cardData = {
      fullName,
      jobTitle,
      about,
      email,
      phone,
      backgroundImageUrl: uploadedBackgroundUrl || null,
      profileImageUrl: uploadedProfileUrl || null,
      linkedinUrl: linkedin || null,
      githubUrl: github || null,
      websiteUrl: website || null,
      skills,
      projects,
      selectedDesignId: selectedDesignId || 1,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cardData),
      });

      if (response.ok) {
        setMessage("Kart başarıyla kaydedildi!");
      } else {
        const errorText = await response.text();
        setMessage("Kaydetme hatası: " + errorText);
      }
    } catch (error) {
      setMessage("İstek sırasında hata oluştu: " + error.message);
    }
  };

  return (
    <div className="card-page">
      {/* Önizleme Alanı */}
      <MyDesigns
        cardid={cardid}
        profileImage={profileImage}
        backgroundImage={backgroundImage}
        profileFile={profileFile}
        backgroundFile={backgroundFile}
        fullName={fullName}
        jobTitle={jobTitle}
        about={about}
        email={email}
        phone={phone}
        linkedin={linkedin}
        github={github}
        website={website}
        skills={skills}
        projects={projects}
        designindex={selectedDesignId}
      />

      {/* Form Alanı */}
      <CardForm
        profileImage={profileImage}
        setProfileFile={setProfileFile}
        profileFile={profileFile}
        backgroundImage={backgroundImage}
        setBackgroundFile={setBackgroundFile}
        backgroundFile={backgroundFile}
        fullName={fullName}
        setFullName={setFullName}
        jobTitle={jobTitle}
        setJobTitle={setJobTitle}
        about={about}
        setAbout={setAbout}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        linkedin={linkedin}
        setLinkedin={setLinkedin}
        github={github}
        setGithub={setGithub}
        website={website}
        setWebsite={setWebsite}
        skills={skills}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        addSkill={addSkill}
        removeSkill={removeSkill}
        projects={projects}
        newProject={newProject}
        setNewProject={setNewProject}
        addProject={addProject}
        removeProject={removeProject}
        showProjectForm={showProjectForm}
        setShowProjectForm={setShowProjectForm}
        handleSave={handleSave}
        message={message}
      />
    </div>
  );
};

export default CardDesign;
