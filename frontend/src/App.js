import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
<<<<<<< HEAD
  const API_BASE = (
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"
  ).replace(/\/+$/, "");

  const [config, setConfig] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [selectedIndustryIds, setSelectedIndustryIds] = useState([]);
  const [locationQuery, setLocationQuery] = useState("Durban, South Africa");
  const [leads, setLeads] = useState([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [message, setMessage] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [deploying, setDeploying] = useState(false);
=======
  const API_BASE =
    process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

  const [lead, setLead] = useState({});
  const [cleaned, setCleaned] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [approvalStatus, setApprovalStatus] = useState("Pending Review");
  const [websiteUrl, setWebsiteUrl] = useState("");
>>>>>>> 6a495c38f6fc2d2f486f4622a72839cc0923131e

  const selectedLeads = useMemo(
    () => leads.filter((lead) => selectedLeadIds.includes(lead.id)),
    [leads, selectedLeadIds]
  );

  const allIndustryIds = useMemo(
    () => industries.map((industry) => industry.id),
    [industries]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [configResponse, industriesResponse] = await Promise.all([
          axios.get(`${API_BASE}/api/config/status`),
          axios.get(`${API_BASE}/api/industries`),
        ]);

        setConfig(configResponse.data);
        setIndustries(industriesResponse.data);
        setSelectedIndustryIds(industriesResponse.data.map((item) => item.id));
        setLocationQuery(configResponse.data.defaultLocationQuery);
      } catch (error) {
        setMessage({
          type: "error",
          title: "Backend connection failed",
          body: explainError(
            error,
            "Start the backend with npm run pipeline, then refresh this page."
          ),
        });
      } finally {
        setLoadingConfig(false);
      }
    };

    loadInitialData();
  }, [API_BASE]);

  const explainError = (error, fallback) => {
    const detail = error?.response?.data?.detail;
    if (detail?.message) {
      return detail.action ? `${detail.message} ${detail.action}` : detail.message;
    }
    if (typeof detail === "string") return detail;
    return fallback;
  };

  const setSuccess = (title, body) => setMessage({ type: "success", title, body });
  const setError = (title, body) => setMessage({ type: "error", title, body });

  const toggleIndustry = (industryId) => {
    setSelectedIndustryIds((current) =>
      current.includes(industryId)
        ? current.filter((id) => id !== industryId)
        : [...current, industryId]
    );
  };

<<<<<<< HEAD
  const toggleLead = (leadId) => {
    setSelectedLeadIds((current) =>
      current.includes(leadId)
        ? current.filter((id) => id !== leadId)
        : [...current, leadId]
    );
  };

  const runScrape = async () => {
    if (!selectedIndustryIds.length) {
      setError(
        "No industry selected",
        "Select at least one preset before running the Apify scrape."
      );
=======
  const fetchLeadFromWebsite = async () => {
    if (!websiteUrl.trim()) {
      setMessage("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Fetching lead data from website...");

      const response = await axios.post(`${API_BASE}/api/scrape/lead`, {
        url: websiteUrl,
      });

      const data = response.data;

      setLead({
        businessName: data.businessName || "Demo Business",
        email: data.email || "info@demobusiness.co.za",
        category: data.category || "General Services",
        location: data.location || "South Africa",
        notes: data.notes || `Lead generated from website: ${websiteUrl}`,
      });

      setCleaned(null);
      setContent(null);
      setErrors({});
      setApprovalStatus("Pending Review");
      setMessage("Lead data fetched successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch lead data. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const validateLead = () => {
    const newErrors = {};

    if (!lead.businessName?.trim()) {
      newErrors.businessName = "Business name is required.";
    }

    if (!lead.email?.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!lead.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!lead.category?.trim()) {
      newErrors.category = "Category / industry is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setMessage("Please fix the highlighted fields.");
      return false;
    }

    setMessage("Lead is valid and ready for cleaning.");
    return true;
  };

  const cleanLead = async () => {
    if (!validateLead()) return;

    try {
      setMessage("Cleaning lead data...");

      const response = await axios.post(`${API_BASE}/api/leads/clean`, {
        businessName: lead.businessName,
        email: lead.email,
        category: lead.category,
        location: lead.location,
        notes: lead.notes,
      });

      setCleaned(response.data);
      setContent(null);
      setApprovalStatus("Pending Review");
      setMessage("Lead cleaned successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Backend cleaning failed. Make sure FastAPI is running.");
    }
  };

  const generateContent = async () => {
    if (!cleaned) {
      setMessage("Clean the lead before generating content.");
>>>>>>> 6a495c38f6fc2d2f486f4622a72839cc0923131e
      return;
    }

    try {
      setScraping(true);
      setDeployments([]);
      setLeads([]);
      setSelectedLeadIds([]);
      setMessage({
        type: "info",
        title: "Scrape running",
        body: `Running ${selectedIndustryIds.length} Apify preset(s), capped at 10 businesses each.`,
      });

      const response = await axios.post(`${API_BASE}/api/scrape`, {
        industryIds: selectedIndustryIds,
        locationQuery,
      });

      setLeads(response.data.leads);
      setSelectedLeadIds(response.data.leads.map((lead) => lead.id));

      if (response.data.failures?.length) {
        setMessage({
          type: "warning",
          title: "Scrape completed with failures",
          body: response.data.failures
            .map((failure) => `${failure.message} ${failure.action}`)
            .join(" "),
        });
      } else {
        setSuccess(
          "Scrape completed",
          `${response.data.leads.length} businesses loaded from Apify for ${response.data.locationQuery}.`
        );
      }
    } catch (error) {
      setError(
        "Scrape failed",
        explainError(
          error,
          "Apify did not return leads. Check the backend logs, token, account credits, and selected location."
        )
      );
    } finally {
      setScraping(false);
    }
  };

  const deploySelected = async () => {
    if (!selectedLeads.length) {
      setError(
        "No businesses selected",
        "Select one or more scraped businesses before deploying landing pages."
      );
      return;
    }

    try {
      setDeploying(true);
      setMessage({
        type: "info",
        title: "Deployment running",
        body: `Generating landing-page context and deploying ${selectedLeads.length} site(s) to Netlify.`,
      });

      const response = await axios.post(`${API_BASE}/api/deploy`, {
        leads: selectedLeads,
      });

      setDeployments(response.data.deployments);
      const failed = response.data.deployments.filter(
        (deployment) => deployment.status === "failed"
      );

      if (failed.length) {
        setMessage({
          type: "warning",
          title: "Deployment completed with failures",
          body: failed
            .map((item) => `${item.businessName}: ${item.error} ${item.action}`)
            .join(" "),
        });
      } else {
        setSuccess(
          "Deployment submitted",
          `${response.data.deployments.length} landing page(s) were submitted to Netlify.`
        );
      }
    } catch (error) {
      setError(
        "Deployment failed",
        explainError(
          error,
          "Netlify did not accept the deployment. Check the token, account permissions, and backend logs."
        )
      );
    } finally {
      setDeploying(false);
    }
  };

<<<<<<< HEAD
  const configured = config?.apifyConfigured && config?.netlifyConfigured;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">No-login scrape to site workflow</p>
          <h1>AI Site Factory Pipeline</h1>
          <p>
            Select industry presets, scrape 10 local businesses per preset, then
            generate and deploy landing pages through Netlify.
          </p>
        </div>
        <div className="status-stack">
          <span className={config?.apifyConfigured ? "status ok" : "status bad"}>
            Apify {config?.apifyConfigured ? "ready" : "missing"}
          </span>
          <span className={config?.netlifyConfigured ? "status ok" : "status bad"}>
            Netlify {config?.netlifyConfigured ? "ready" : "missing"}
          </span>
          <span className="status neutral">10 per preset</span>
        </div>
=======
  const downloadPreview = () => {
    if (!content) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${content.headline}</title>
</head>
<body>
  <h1>${content.headline}</h1>
  <p>${content.summary}</p>

  <h2>Services</h2>
  <ul>
    ${content.services
      .map((service) =>
        typeof service === "string"
          ? `<li>${service}</li>`
          : `<li><strong>${service.title}</strong>: ${service.description}</li>`
      )
      .join("")}
  </ul>

  <p><strong>${content.cta}</strong></p>
</body>
</html>
`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "preview-website.html";
    link.click();

    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    setLead({});
    setCleaned(null);
    setContent(null);
    setLoading(false);
    setMessage("");
    setErrors({});
    setApprovalStatus("Pending Review");
    setWebsiteUrl("");
  };

  return (
    <div className="app">
      <header className="header">
        <span className="badge">Phase 1 Frontend + Backend</span>
        <h1>AI Site Factory</h1>
        <p>
          Lead intake, scraper demo, data cleaning, backend content generation,
          and preview website workflow.
        </p>
>>>>>>> 6a495c38f6fc2d2f486f4622a72839cc0923131e
      </header>

      {message && (
        <section className={`notice ${message.type}`}>
          <strong>{message.title}</strong>
          <span>{message.body}</span>
        </section>
      )}

      {!configured && !loadingConfig && (
        <section className="notice error">
          <strong>Configuration required</strong>
          <span>
            Add the Apify and Netlify tokens to the root .env file and restart
            the backend before running the live pipeline.
          </span>
        </section>
      )}

      <main className="workspace">
        <section className="panel controls">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Step 1</p>
              <h2>Choose scrape presets</h2>
            </div>
            <button
              className="ghost"
              onClick={() =>
                setSelectedIndustryIds(
                  selectedIndustryIds.length === allIndustryIds.length
                    ? []
                    : allIndustryIds
                )
              }
              disabled={loadingConfig}
            >
<<<<<<< HEAD
              {selectedIndustryIds.length === allIndustryIds.length
                ? "Clear all"
                : "Select all"}
            </button>
          </div>

          <label className="field">
            <span>Target market / location</span>
=======
              2. Clean
            </div>

            <div
              className={
                loading ? "step active" : content ? "step done" : "step"
              }
            >
              3. Generate
            </div>

            <div className={content ? "step done" : "step"}>4. Preview</div>
          </div>

          <section className="card">
            <div className="scraper-box">
              <h3>Website Lead Scraper</h3>
              <p className="helper">
                Enter a public website URL to fetch demo lead data into the form.
              </p>

              <input
                type="text"
                placeholder="Enter website URL"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />

              <button onClick={fetchLeadFromWebsite} disabled={loading}>
                {loading ? "Fetching..." : "Fetch Lead From Website"}
              </button>
            </div>

            <h2>Lead Intake</h2>
            <p className="helper">Enter raw business lead details below.</p>

>>>>>>> 6a495c38f6fc2d2f486f4622a72839cc0923131e
            <input
              value={locationQuery}
              onChange={(event) => setLocationQuery(event.target.value)}
              placeholder="Durban, South Africa"
            />
          </label>

          <div className="industry-grid">
            {industries.map((industry) => (
              <label
                className={
                  selectedIndustryIds.includes(industry.id)
                    ? "industry selected"
                    : "industry"
                }
                key={industry.id}
              >
                <input
                  type="checkbox"
                  checked={selectedIndustryIds.includes(industry.id)}
                  onChange={() => toggleIndustry(industry.id)}
                />
                <span>
                  <strong>{industry.label}</strong>
                  <small>{industry.inputTemplate.searchStringsArray[0]}</small>
                </span>
              </label>
            ))}
          </div>

          <button className="primary" onClick={runScrape} disabled={scraping}>
            {scraping ? "Scraping Apify..." : "Run Apify scrape"}
          </button>
        </section>

        <section className="panel leads">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Step 2</p>
              <h2>Review businesses</h2>
            </div>
            <div className="action-row">
              <button
                className="ghost"
                onClick={() => setSelectedLeadIds(leads.map((lead) => lead.id))}
                disabled={!leads.length}
              >
                Select leads
              </button>
              <button
                className="ghost"
                onClick={() => setSelectedLeadIds([])}
                disabled={!selectedLeadIds.length}
              >
                Clear leads
              </button>
            </div>
          </div>

<<<<<<< HEAD
          <div className="lead-summary">
            <span>{leads.length} scraped</span>
            <span>{selectedLeadIds.length} selected</span>
          </div>
=======
              {loading && (
                <div className="loading-box">
                  <div className="spinner"></div>
                  <p>Backend is processing the request...</p>
                </div>
              )}
            </section>
          ) : (
            <section className="card empty-state">
              <h2>Cleaned Data</h2>
              <p>Complete lead intake and clean the data to continue.</p>
            </section>
          )}
>>>>>>> 6a495c38f6fc2d2f486f4622a72839cc0923131e

          <div className="lead-table">
            {leads.length ? (
              leads.map((lead) => (
                <label
                  className={
                    selectedLeadIds.includes(lead.id)
                      ? "lead-row checked"
                      : "lead-row"
                  }
                  key={lead.id}
                >
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(lead.id)}
                    onChange={() => toggleLead(lead.id)}
                  />
                  <span className="lead-main">
                    <strong>{lead.businessName}</strong>
                    <small>{lead.category}</small>
                  </span>
                  <span>{lead.phone || "No phone"}</span>
                  <span>{lead.website || lead.googleMapsUrl || "No URL"}</span>
                  <span>{lead.rating ? `${lead.rating} stars` : "No rating"}</span>
                </label>
              ))
            ) : (
              <div className="empty">
                Run a scrape to populate businesses from Apify.
              </div>
            )}
          </div>
        </section>

        <section className="panel deploy">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Step 3</p>
              <h2>Generate and deploy</h2>
            </div>
            <button
              className="primary"
              onClick={deploySelected}
              disabled={deploying || !selectedLeads.length}
            >
              {deploying ? "Deploying..." : "Deploy selected"}
            </button>
          </div>

<<<<<<< HEAD
          <div className="deploy-list">
            {deployments.length ? (
              deployments.map((deployment) => (
                <article className="deployment" key={deployment.leadId}>
                  <div className="deployment-top">
                    <div>
                      <strong>{deployment.businessName}</strong>
                      <span className={`deploy-status ${deployment.status}`}>
                        {deployment.status}
                      </span>
=======
              <h2>Preview Website</h2>
              <p className="helper">
                Reviewable website preview generated from the content packet.
              </p>

              <div className="preview">
                <h1>{content.headline}</h1>
                <p>{content.summary}</p>

                <div className="service-grid">
                  {content.services.map((service, index) => (
                    <div className="service-card" key={index}>
                      <span>0{index + 1}</span>
                      {typeof service === "string" ? (
                        <p>{service}</p>
                      ) : (
                        <>
                          <h3>{service.title}</h3>
                          <p>{service.description}</p>
                        </>
                      )}
>>>>>>> 6a495c38f6fc2d2f486f4622a72839cc0923131e
                    </div>
                    {deployment.deployUrl && (
                      <a href={deployment.deployUrl} target="_blank" rel="noreferrer">
                        Open site
                      </a>
                    )}
                  </div>
                  {deployment.error ? (
                    <p className="failure">
                      {deployment.error} {deployment.action}
                    </p>
                  ) : (
                    <p>{deployment.prompt}</p>
                  )}
                </article>
              ))
            ) : (
              <div className="empty">
                Deployments will appear here with the generated prompt and
                Netlify URL.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
