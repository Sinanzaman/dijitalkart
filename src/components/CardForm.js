const CardForm = ({
  profileImage,
  setProfileFile,
  profileFile,
  backgroundImage,
  setBackgroundFile,
  backgroundFile,
  fullName,
  setFullName,
  jobTitle,
  setJobTitle,
  about,
  setAbout,
  email,
  setEmail,
  phone,
  setPhone,
  linkedin,
  setLinkedin,
  github,
  setGithub,
  website,
  setWebsite,
  skills,
  newSkill,
  setNewSkill,
  addSkill,
  removeSkill,
  projects,
  newProject,
  setNewProject,
  addProject,
  removeProject,
  showProjectForm,
  setShowProjectForm,
  handleSave,
  message,
}) => {
  return (
    <div className="form">
      {/* Profil Resmi */}
      <div>
        <label>Profil Resmi:</label>
        {profileFile ? (
          <p>{profileFile.name}</p>
        ) : profileImage ? (
          <p>Bulut sistemde mevcut</p>
        ) : (
          <p>Dosya seçilmedi</p>
        )}
        <button onClick={() => document.getElementById("profileInput").click()}>
          Dosya Seç
        </button>
        <input
          id="profileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setProfileFile(file);
            }
          }}
        />
      </div>

      {/* Arka Plan Resmi */}
      <div>
        <label>Arka Plan Resmi:</label>
        {backgroundFile ? (
          <p>{backgroundFile.name}</p>
        ) : backgroundImage ? (
          <p>Bulut sistemde mevcut</p>
        ) : (
          <p>Dosya seçilmedi</p>
        )}
        <button onClick={() => document.getElementById("backgroundInput").click()}>
          Dosya Seç
        </button>
        <input
          id="backgroundInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setBackgroundFile(file);
            }
          }}
        />
      </div>

      {/* Diğer alanlar */}
      <label>
        Ad Soyad:
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </label>

      <label>
        İş Pozisyonu:
        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
      </label>

      <label>
        Hakkında:
        <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4} />
      </label>

      <label>
        Telefon:
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 555 555 5555" />
      </label>

      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label>
        LinkedIn:
        <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
      </label>

      <label>
        Github:
        <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} />
      </label>

      <label>
        Websitesi:
        <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>

      {/* Yetenekler */}
      <label>
        Yetenekler:
        <div className="skills-input">
          <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
          <button type="button" onClick={addSkill}>Ekle</button>
        </div>
      </label>
      <div>
        {skills.map((skill) => (
          <span key={skill} className="skills-badge" onClick={() => removeSkill(skill)}>
            {skill} &times;
          </span>
        ))}
      </div>

      {/* Projeler */}
      <div style={{ marginTop: "20px" }}>
        {!showProjectForm && (
          <button type="button" onClick={() => setShowProjectForm(true)}>
            Proje Ekle
          </button>
        )}

        {showProjectForm && (
          <div className="project-form">
            <label>
              Proje Başlığı:
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </label>
            <label>
              Açıklama:
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </label>
            <label>
              Resim URL:
              <input
                type="text"
                value={newProject.imageUrl}
                onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
              />
            </label>
            <label>
              Proje Linki:
              <input
                type="url"
                value={newProject.projectUrl}
                onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })}
              />
            </label>

            <button onClick={addProject}>Kaydet</button>
            <button onClick={() => setShowProjectForm(false)}>İptal</button>
          </div>
        )}

        {/* Proje Listesi */}
        <div>
          {projects.map((project, index) => (
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
              <p><a href={project.projectUrl} target="_blank" rel="noreferrer">Projeyi Gör</a></p>
              <button onClick={() => removeProject(index)}>Sil</button>
            </div>
          ))}
        </div>
      </div>

      {/* Kaydet Butonu */}
      <button className="save-btn" onClick={handleSave} style={{ marginTop: "20px" }}>
        Kaydet
      </button>

      {message && (
        <div className="message" style={{ color: message.includes("hata") ? "red" : "green" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CardForm;
