import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import { useToast } from "../components/Toast";
import { getUser } from "../services/authService";
import api from "../services/api";
import "../styles/EyeProfile.css";

// Dropdown options cho tung thong so mat
const SPH_OPTIONS = [];
for (let v = -20; v <= 8; v = Math.round((v + 0.25) * 100) / 100) {
  SPH_OPTIONS.push(parseFloat(v.toFixed(2)));
}

const CYL_OPTIONS = [];
for (let v = -8; v <= 0; v = Math.round((v + 0.25) * 100) / 100) {
  CYL_OPTIONS.push(parseFloat(v.toFixed(2)));
}

const AXIS_OPTIONS = Array.from({ length: 181 }, (_, i) => i);

const PD_OPTIONS = [];
for (let v = 55; v <= 75; v = Math.round((v + 0.5) * 10) / 10) {
  PD_OPTIONS.push(parseFloat(v.toFixed(1)));
}

const ADD_OPTIONS = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0];

const FIELD_OPTIONS = {
  sph:  SPH_OPTIONS,
  cyl:  CYL_OPTIONS,
  axis: AXIS_OPTIONS,
  pd:   PD_OPTIONS,
  add:  ADD_OPTIONS,
};



const EYE_FIELDS = [
  { key: "sph", label: "SPH", placeholder: "e.g. -2.50" },
  { key: "cyl", label: "CYL", placeholder: "e.g. -0.75" },
  { key: "axis", label: "Axis", placeholder: "0 - 180" },
  { key: "pd", label: "PD (mm)", placeholder: "e.g. 62" },
  { key: "add", label: "ADD", placeholder: "e.g. 1.00" },
];

const INITIAL_FORM = {
  profileName: "",
  rightEye: { eyeSide: "RIGHT", sph: "0", cyl: "0", axis: "0", pd: "62", add: "0" },
  leftEye: { eyeSide: "LEFT", sph: "0", cyl: "0", axis: "0", pd: "62", add: "0" },
};

export default function EyeProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [user] = useState(() => getUser());
  const [keyword, setKeyword] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfiles();
  }, [navigate, user]);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/catalog?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await api.get("/api/eye-profiles/me");
      setProfiles(Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      const serverData = error.response?.data;
      const serverMessage =
        serverData?.message
        || serverData?.error
        || (typeof serverData === "string" ? serverData : "");

      console.error("Eye profile fetch failed", {
        status: error.response?.status,
        data: serverData,
        message: error.message,
      });

      setProfiles([]);
      setLoadError(serverMessage || "Unable to load your eye profiles right now.");
      toast({
        message: serverMessage || "Unable to load your eye profiles right now.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEyeChange = (side, field, value) => {
    setForm((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        [field]: value,
      },
    }));
  };

  const resetForm = () => setForm(INITIAL_FORM);

  const handleSubmit = async () => {
    if (!form.profileName.trim()) {
      toast({ message: "Please enter a profile name.", type: "warning" });
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/eye-profiles/manual", {
        profileName: form.profileName,
        rightEye: {
          eyeSide: "RIGHT",
          sph: parseFloat(form.rightEye.sph) || 0,
          cyl: parseFloat(form.rightEye.cyl) || 0,
          axis: parseInt(form.rightEye.axis, 10) || 0,
          pd: parseFloat(form.rightEye.pd) || 62,
          add: parseFloat(form.rightEye.add) || 0,
        },
        leftEye: {
          eyeSide: "LEFT",
          sph: parseFloat(form.leftEye.sph) || 0,
          cyl: parseFloat(form.leftEye.cyl) || 0,
          axis: parseInt(form.leftEye.axis, 10) || 0,
          pd: parseFloat(form.leftEye.pd) || 62,
          add: parseFloat(form.leftEye.add) || 0,
        },
      });

      toast({ message: "Eye profile created successfully.", type: "success" });
      setShowForm(false);
      resetForm();
      fetchProfiles();
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to create this eye profile.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this eye profile?")) return;

    try {
      await api.patch(`/api/eye-profiles/${id}/deactivate`);
      toast({ message: "Eye profile deactivated.", type: "success" });
      fetchProfiles();
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to deactivate this eye profile.",
        type: "error",
      });
    }
  };

  return (
    <div className="eye-profile-page">
      <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />

      <main className="eye-profile-main">
        <div className="electro-shell">
          <div className="eye-profile-head">
            <div>
              <h1>Eye Profile</h1>
            </div>
          </div>

          <div className="eye-profile-toolbar">
            <button className="eye-profile-primary-btn" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? "Close Form" : "Create New Profile"}
            </button>
          </div>

          {showForm && (
            <section className="eye-profile-form-card">
              <div className="eye-profile-section-head">
                <h2>Create Eye Profile</h2>
              </div>

              <label className="eye-profile-field eye-profile-field--full">
                <span>Profile Name</span>
                <input
                  placeholder="e.g. March 2026 prescription"
                  value={form.profileName}
                  onChange={(event) => setForm({ ...form, profileName: event.target.value })}
                />
              </label>

              <div className="eye-profile-grid">
                {[
                  { side: "rightEye", label: "Right Eye (OD)" },
                  { side: "leftEye", label: "Left Eye (OS)" },
                ].map(({ side, label }) => (
                  <div key={side} className="eye-profile-eye-card">
                    <div className="eye-profile-eye-head">
                      <span />
                      <h3>{label}</h3>
                    </div>

                    <div className="eye-profile-eye-fields">
                      {EYE_FIELDS.map((field) => (
                        <label key={field.key} className="eye-profile-field-row">
                          <span>{field.label}</span>
                          <select
                            value={form[side][field.key]}
                            onChange={(event) => handleEyeChange(side, field.key, event.target.value)}
                            style={{ width:"100%", padding:"8px 10px", border:"1px solid #ddd", borderRadius:4, fontSize:14, outline:"none", background:"white", cursor:"pointer" }}
                          >
                            
                            {(FIELD_OPTIONS[field.key] || []).map((opt) => (
                              <option key={opt} value={opt}>
                                {field.key === "sph" && opt > 0 ? "+" + opt :
                                 field.key === "axis" ? opt + "°" :
                                 field.key === "pd" ? opt + " mm" : opt}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="eye-profile-action-row">
                <button className="eye-profile-primary-btn" onClick={handleSubmit} disabled={saving}>
                  {saving ? "Saving..." : "Save Eye Profile"}
                </button>
                <button
                  className="eye-profile-secondary-btn"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </section>
          )}

          {loading ? (
            <div className="eye-profile-empty">Loading eye profiles...</div>
          ) : loadError ? (
            <div className="eye-profile-empty eye-profile-empty--center">
              <div className="eye-profile-empty-icon">!</div>
              <h2>Unable to Load Eye Profiles</h2>
              <p>{loadError}</p>
              <button className="eye-profile-primary-btn" onClick={fetchProfiles}>
                Retry
              </button>
            </div>
          ) : profiles.length === 0 ? (
            <div className="eye-profile-empty eye-profile-empty--center">
              <div className="eye-profile-empty-icon">⌁</div>
              <h2>No eye profiles yet</h2>
              <p>Create your first eye profile to use accurate prescription data in future orders.</p>
              <button className="eye-profile-primary-btn" onClick={() => setShowForm(true)}>
                Create First Profile
              </button>
            </div>
          ) : (
            <div className="eye-profile-list">
              {profiles.map((profile) => (
                <article key={profile.eyeProfileId} className="eye-profile-card">
                  <div className="eye-profile-card-top">
                    <div className="eye-profile-card-copy">
                      <div className="eye-profile-card-icon">⌁</div>
                      <div>
                        <h3>{profile.profileName}</h3>
                        <p>
                          {(profile.source === "MANUAL" ? "Manual Entry" : "Uploaded File")}
                          {profile.createdDate ? ` • ${new Date(profile.createdDate).toLocaleDateString("vi-VN")}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="eye-profile-card-actions">
                      <span className={profile.status === "ACTIVE" ? "active" : "inactive"}>
                        {profile.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>

                      {profile.status === "ACTIVE" && (
                        <button className="eye-profile-secondary-btn" onClick={() => handleDeactivate(profile.eyeProfileId)}>
                          Deactivate
                        </button>
                      )}

                      {profile.status === "ACTIVE" && (
                        <button
                          className="eye-profile-primary-btn"
                          onClick={() => navigate("/design-glasses", { state: { eyeProfileId: profile.eyeProfileId } })}
                        >
                          Design Now
                        </button>
                      )}
                    </div>
                  </div>

                  {profile.prescriptions?.length > 0 && (
                    <div className="eye-profile-table-wrap">
                      <table className="eye-profile-table">
                        <thead>
                          <tr>
                            <th>Eye</th>
                            <th>SPH</th>
                            <th>CYL</th>
                            <th>Axis</th>
                            <th>PD</th>
                            <th>ADD</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profile.prescriptions.map((item) => (
                            <tr key={item.prescriptionId}>
                              <td className={item.eyeSide === "RIGHT" ? "right" : "left"}>
                                {item.eyeSide === "RIGHT" ? "Right Eye" : "Left Eye"}
                              </td>
                              {["sph", "cyl", "axis", "pd", "add"].map((key) => (
                                <td key={key}>{item[key] ?? "-"}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}