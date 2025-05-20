import React, { useState, useEffect } from "react";
import "../CSS/CardDesign.css";

const CardDesign = () => {
  const [profileImage, setProfileImage] = useState("");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [about, setAbout] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState([]);
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
          setFullName(data.fullName || "");
          setJobTitle(data.jobTitle || "");
          setAbout(data.about || "");
          setPhone(data.phone || "");
          setLinkedin(data.linkedinUrl || "");
          setGithub(data.githubUrl || "");
          setWebsite(data.websiteUrl || "");
          setSkills(data.skills || []);
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
    setProjects(projects.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    const cardData = {
      fullName,
      jobTitle,
      about,
      phone,
      profileImageUrl: profileImage || null,
      linkedinUrl: linkedin || null,
      githubUrl: github || null,
      websiteUrl: website || null,
      skills,
      projects,
      selectedDesignId: 1 || null,
    };

    const token = localStorage.getItem("token");
    console.log("Token:", token);

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
        let responseData = null;
        const text = await response.text();
        if (text) {
          responseData = JSON.parse(text);
        }
        setMessage("Kart başarıyla kaydedildi!");
      } else {
        let errorData = null;
        const text = await response.text();
        if (text) {
          errorData = JSON.parse(text);
        }
        setMessage("Kaydetme hatası: " + (errorData?.message || response.statusText));
      }
    } catch (error) {
      setMessage("İstek sırasında hata oluştu: " + error.message);
    }
  };

  return (
    <div className="card-page">
      {/* Önizleme Alanı */}
      <div className="preview">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profil"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div className="placeholder">Profil Resmi Yok</div>
        )}

        <h2>{fullName || "Ad Soyad"}</h2>
        <h4>{jobTitle || "İş Pozisyonu"}</h4>
        <p>{about || "Hakkında kısmı burada görünecek."}</p>
        <p>
          <b>Telefon:</b> {phone || "-"}
        </p>

        <p>
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noreferrer">
              Github
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noreferrer">
              Websitesi
            </a>
          )}
        </p>

        <div>
          <b>Yetenekler:</b>
          <ul>
            {skills.length > 0 ? (
              skills.map((skill) => <li key={skill}>{skill}</li>)
            ) : (
              <li>Henüz eklenmedi</li>
            )}
          </ul>
        </div>

        <div>
          <b>Projeler:</b>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={index} className="project-item">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={{ maxWidth: "150px", maxHeight: "100px" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <p>
                  <a href={project.projectUrl} target="_blank" rel="noreferrer">
                    Projeyi Gör
                  </a>
                </p>
              </div>
            ))
          ) : (
            <p>Henüz proje eklenmedi</p>
          )}
        </div>
      </div>

      {/* Form Alanı */}
      <div className="form">
        <label>
          Profil Resmi URL:
          <input
            type="text"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder="https://..."
          />
        </label>
        <label>
          Ad Soyad:
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>
        <label>
          İş Pozisyonu:
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </label>
        <label>
          Hakkında:
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
          />
        </label>
        <label>
          Telefon:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90 555 555 5555"
          />
        </label>
        <label>
          LinkedIn:
          <input
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </label>
        <label>
          Github:
          <input
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="https://github.com/username"
          />
        </label>
        <label>
          Websitesi:
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
          />
        </label>

        {/* Yetenekler */}
        <label>
          Yetenekler:
          <div className="skills-input">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Yeni yetenek"
            />
            <button type="button" onClick={addSkill}>
              Ekle
            </button>
          </div>
        </label>
        <div>
          {skills.map((skill) => (
            <span
              key={skill}
              className="skills-badge"
              onClick={() => removeSkill(skill)}
              title="Kaldırmak için tıkla"
            >
              {skill} &times;
            </span>
          ))}
        </div>

        {/* Proje Ekleme */}
        <div style={{ marginTop: "20px" }}>
          {!showProjectForm && (
            <button type="button" onClick={() => setShowProjectForm(true)}>
              Proje Ekle
            </button>
          )}

          {showProjectForm && (
            <div className="project-form" style={{ marginTop: "10px" }}>
              <label>
                Proje Başlığı:
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder="Proje başlığı"
                />
              </label>
              <label>
                Proje Açıklaması:
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  rows={2}
                  placeholder="Proje açıklaması"
                />
              </label>
              <label>
                Proje Resmi URL:
                <input
                  type="text"
                  value={newProject.imageUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </label>
              <label>
                Proje Linki:
                <input
                  type="url"
                  value={newProject.projectUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, projectUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </label>

              <button type="button" onClick={addProject}>
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setShowProjectForm(false)}
                style={{ marginLeft: "10px" }}
              >
                İptal
              </button>
            </div>
          )}

          {/* Proje Listesi */}
          <div>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div
                  key={index}
                  className="project-item"
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      style={{ maxWidth: "150px", maxHeight: "100px" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                  <p>
                    <a href={project.projectUrl} target="_blank" rel="noreferrer">
                      Projeyi Gör
                    </a>
                  </p>
                  <button onClick={() => removeProject(index)}>Sil</button>
                </div>
              ))
            ) : (
              <p>Henüz proje eklenmedi</p>
            )}
          </div>
        </div>

        {/* Kaydet Butonu */}
        <button className="save-btn" onClick={handleSave} style={{ marginTop: "20px" }}>
          Kaydet
        </button>

        {message && (
          <div
            className="message"
            style={{ color: message.includes("hata") ? "red" : "green", marginTop: "10px" }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDesign;
