import React, { useState, useEffect } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    stageName: "",
    contact: "",
    email: "",
    industry: "",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState([]);

  // Auto-save draft functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name || formData.email || formData.message) {
        const draft = {
          ...formData,
          timestamp: new Date().toLocaleString(),
          id: Date.now(),
        };
        const existingDrafts = JSON.parse(
          localStorage.getItem("contactDrafts") || "[]"
        );
        const newDrafts = [draft, ...existingDrafts.slice(0, 2)]; // Keep only 3 drafts
        localStorage.setItem("contactDrafts", JSON.stringify(newDrafts));
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Load saved drafts on component mount
  useEffect(() => {
    const drafts = JSON.parse(localStorage.getItem("contactDrafts") || "[]");
    setSavedDrafts(drafts);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, file: "File must be less than 10MB" });
        return;
      }
      setFile(selectedFile);
      setErrors({ ...errors, file: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.contact.trim())) {
      newErrors.contact = "Please enter a valid phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please tell us about yourself and your goals";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message should be at least 20 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = () => {
    const subject = `New Talent Application - ${formData.name}`;
    const body = `
New talent application received:

Name: ${formData.name}
Stage Name: ${formData.stageName || "Not provided"}
Phone: ${formData.contact}
Email: ${formData.email}
Industry: ${formData.industry || "Not specified"}

Message:
${formData.message}

${file ? `File attached: ${file.name}` : "No file attached"}

Application submitted on: ${new Date().toLocaleString()}
    `;

    const mailtoLink = `mailto:info.wellfire@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Send email automatically
      sendEmail();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccess(true);

      // Clear form and localStorage
      setFormData({
        name: "",
        stageName: "",
        contact: "",
        email: "",
        industry: "",
        message: "",
      });
      setFile(null);
      setCurrentStep(1);
      localStorage.removeItem("contactDrafts");

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadDraft = (draft) => {
    setFormData({
      name: draft.name,
      stageName: draft.stageName,
      contact: draft.contact,
      email: draft.email,
      industry: draft.industry,
      message: draft.message,
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const stepOneErrors = {};
      if (!formData.name.trim()) stepOneErrors.name = "Full name is required";
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        stepOneErrors.email = "Valid email is required";
      }
      if (!formData.contact.trim())
        stepOneErrors.contact = "Contact is required";

      if (Object.keys(stepOneErrors).length === 0) {
        setCurrentStep(2);
        setErrors({});
      } else {
        setErrors(stepOneErrors);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleCall = () => {
    window.location.href = "tel:+917506312117";
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in working with ZIPPIN Entertainment. My name is ${
      formData.name || "[Your Name]"
    }.`;
    window.open(
      `https://wa.me/917506312117?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleQuickEmail = () => {
    window.location.href =
      "mailto:info.wellfire@gmail.com?subject=Quick Inquiry - ZIPPIN Entertainment";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  bg-black text-white">
      {/* Floating Contact Bar */}
      <div className="fixed top-4 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={handleCall}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Call us now"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Call: +91 75063 12117
          </span>
        </button>

        <button
          onClick={handleWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="WhatsApp us"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            WhatsApp
          </span>
        </button>

        <button
          onClick={handleQuickEmail}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Email us"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            info.wellfire@gmail.com
          </span>
        </button>
      </div>

      {/* Auto-save Indicator */}
      {isTyping && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-full text-sm z-40 flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Saving draft...</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-black mb-3 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            JOIN OUR  NETWORK
          </h1>
         
          {/* Enhanced Contact Info Bar */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
           
          
          </div>
        </div>
      </div>

      {/* Saved Drafts Section */}
      {savedDrafts.length > 0 && currentStep === 1 && (
        <div className="px-4 sm:px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-yellow-300 mb-2">
                 Continue from where you left off
              </h3>
              <div className="flex flex-wrap gap-2">
                {savedDrafts.slice(0, 2).map((draft, index) => (
                  <button
                    key={draft.id}
                    onClick={() => loadDraft(draft)}
                    className="bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-100 px-3 py-1 rounded text-xs transition-colors"
                  >
                    {draft.name || "Unnamed"} - {draft.timestamp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Enhanced Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-400">
                  Step {currentStep} of 2
                </span>
                {currentStep === 1 && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                   
                  </span>
                )}
                {currentStep === 2 && (
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                    Profile Details
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showPreview ? "Hide Preview" : "Show Preview"} 
              </button>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500 relative"
                style={{ width: currentStep === 1 ? "50%" : "100%" }}
              >
                <div className="absolute right-0 top-0 h-full w-4 bg-white/30 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="mb-8 bg-gray-800/20 rounded-xl p-6 border border-gray-700/30">
              <h3 className="text-lg font-semibold mb-4">
                 Application Preview
              </h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p>
                  <strong>Name:</strong> {formData.name || "Not entered"}
                </p>
                <p>
                  <strong>Stage Name:</strong>{" "}
                  {formData.stageName || "Not provided"}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email || "Not entered"}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.contact || "Not entered"}
                </p>
                <p>
                  <strong>Industry:</strong>{" "}
                  {formData.industry || "Not specified"}
                </p>
                <p>
                  <strong>Message:</strong>{" "}
                  {formData.message
                    ? `${formData.message.substring(0, 100)}...`
                    : "Not entered"}
                </p>
                <p>
                  <strong>File:</strong> {file ? file.name : "No file selected"}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
            {currentStep === 1 ? (
              /* Step 1: Enhanced Basic Info */
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Let's Get Started 
                  </h2>
                 
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    Full Name <span className="text-red-500 ml-1">*</span>
                    <span className="ml-2 text-xs text-gray-500">
                      (as per official documents)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full legal name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-gray-700/50 border ${
                      errors.name ? "border-red-500" : "border-gray-600"
                    } text-white px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/20`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    Stage/Professional Name
                    <span className="text-gray-500 text-xs ml-2">
                      (Optional)
                    </span>
                   
                  </label>
                  <input
                    type="text"
                    name="stageName"
                    placeholder="e.g., John Artist, DJ Phoenix, MC Thunder"
                    value={formData.stageName}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/20"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    The name you perform or work under professionally
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                      Phone Number <span className="text-red-500 ml-1">*</span>
                      <span className="ml-2 text-xs text-gray-500">
                         We'll call
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="+91 98765 43210"
                      value={formData.contact}
                      onChange={handleChange}
                      className={`w-full bg-gray-700/50 border ${
                        errors.contact ? "border-red-500" : "border-gray-600"
                      } text-white px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/20`}
                    />
                    {errors.contact && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.contact}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                      Email Address <span className="text-red-500 ml-1">*</span>
                      <span className="ml-2 text-xs text-gray-500">
                         Primary communication
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-gray-700/50 border ${
                        errors.email ? "border-red-500" : "border-gray-600"
                      } text-white px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/20`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Profile Details</span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Enhanced Profile Details */
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Your Profile </h2>
                  <p className="text-gray-400">
                    Share your background and aspirations with us
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    Industry/Field
                    <span className="text-gray-500 text-xs ml-2">
                      (Optional)
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                       Help us categorize your talent
                    </span>
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/20"
                  >
                    <option value="">Select your primary field</option>
                    <option value="Music">
                       Music (Singer, Musician, Composer)
                    </option>
                    <option value="Film">
                       Film & TV (Actor, Director, Producer)
                    </option>
                    <option value="Dance">
                       Dance (Choreographer, Dancer)
                    </option>
                    <option value="Comedy">
                       Comedy (Stand-up, Comedy Writing)
                    </option>
                    <option value="Theater">
                       Theater (Stage Actor, Playwright)
                    </option>
                    <option value="Content">
                       Content Creation (YouTube, Social Media)
                    </option>
                    <option value="Writing">
                       Writing (Screenwriter, Author)
                    </option>
                    <option value="Photography">
                       Photography/Videography
                    </option>
                    <option value="Other">
                       Other (Please specify in message)
                    </option>
                  </select>
                  <p className="text-gray-500 text-xs mt-1">
                    Choose the field that best represents your primary talent
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    About You & Your Goals{" "}
                    <span className="text-red-500 ml-1">*</span>
                    <span className="ml-2 text-xs text-gray-500">
                       Be authentic and specific
                    </span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us your story! Include:
"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full bg-gray-700/50 border ${
                      errors.message ? "border-red-500" : "border-gray-600"
                    } text-white px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 resize-vertical focus:ring-2 focus:ring-red-500/20`}
                  ></textarea>
                  <div className="flex justify-between items-center mt-1">
                    {errors.message ? (
                      <p className="text-red-400 text-sm flex items-center">
                        <span className="mr-1">⚠️</span> {errors.message}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs">
                        Minimum 20 characters • Be detailed and honest
                      </p>
                    )}
                    <span
                      className={`text-xs ${
                        formData.message.length < 20
                          ? "text-red-400"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.message.length}/1000
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    Resume/Portfolio
                    <span className="text-gray-500 text-xs ml-2">
                      (Highly Recommended)
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                       Showcase your best work
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3,.zip"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="w-full bg-gray-700/30 border-2 border-dashed border-gray-600 hover:border-red-500 text-gray-400 hover:text-white px-4 py-8 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-3 hover:bg-gray-700/50"
                    >
                      <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">
                          {file
                            ? "Click to change file"
                            : "Drop your file here or click to browse"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PDF, DOC, Images, Videos, Audio, ZIP (Max 10MB)
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                           Portfolio, demo reel, music samples, or resume
                        </p>
                      </div>
                    </label>
                  </div>

                  {file && (
                    <div className="mt-4 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                              {file.type || "Unknown type"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-600/20 transition-colors"
                          title="Remove file"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.file && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span> {errors.file}
                    </p>
                  )}
                </div>

                {/* Social Media Links - New Feature */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    Social Media/Portfolio Links
                    <span className="text-gray-500 text-xs ml-2">
                      (Optional)
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                       Show us your online presence
                    </span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder=" YouTube/Spotify profile"
                      className="w-full bg-gray-700/50 border border-gray-600 text-white px-4 py-2 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Instagram handle"
                      className="w-full bg-gray-700/50 border border-gray-600 text-white px-4 py-2 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 text-sm"
                    />
                    <input
                      type="url"
                      placeholder=" LinkedIn/Portfolio website"
                      className="w-full bg-gray-700/50 border border-gray-600 text-white px-4 py-2 rounded-lg focus:border-red-500 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Add links to your best work and social profiles
                  </p>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 hover:shadow-xl"
                    } flex items-center justify-center space-x-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Submitting & Sending Email...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Profile & Send Email</span>
                        <span className="text-lg"></span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Help Section */}
          <div className="mt-8 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl p-6 border border-gray-600/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center space-x-2">
              <span></span>
              <span>Need Help? We're Here for You!</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <p className="font-medium text-blue-300 mb-2">
                  Quick Email Support
                </p>
                <button
                  onClick={handleQuickEmail}
                  className="text-blue-400 hover:text-blue-300 underline text-xs"
                >
                  info.wellfire@gmail.com
                </button>
                <p className="text-gray-400 text-xs mt-1">
                  Response within 24 hours
                </p>
              </div>

              <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-600/30">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <p className="font-medium text-green-300 mb-2">
                  Immediate Phone Support
                </p>
                <button
                  onClick={handleCall}
                  className="text-green-400 hover:text-green-300 underline text-xs"
                >
                  +91 75063 12117
                </button>
                <p className="text-gray-400 text-xs mt-1">
                  Available 9 AM - 8 PM IST
                </p>
              </div>

              <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </div>
                <p className="font-medium text-green-300 mb-2">WhatsApp Chat</p>
                <button
                  onClick={handleWhatsApp}
                  className="text-green-400 hover:text-green-300 underline text-xs"
                >
                  Chat with us now
                </button>
                <p className="text-gray-400 text-xs mt-1">
                  Instant response 
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-6 pt-6 border-t border-gray-600/30">
              <h4 className="font-semibold mb-3 text-center">
                ❓ Frequently Asked Questions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-gray-300">
                    Q: How long does the review process take?
                  </p>
                  <p className="text-gray-400">
                    A: We review applications within 2-3 business days.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-300">
                    Q: What file formats do you accept?
                  </p>
                  <p className="text-gray-400">
                    A: PDF, DOC, images, videos, audio files, and ZIP archives.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-300">
                    Q: Do I need professional experience?
                  </p>
                  <p className="text-gray-400">
                    A: No! We welcome both beginners and experienced talents.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-300">
                    Q: Is there any application fee?
                  </p>
                  <p className="text-gray-400">
                    A: Absolutely not. Our application process is completely
                    free.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Your information is 100% secure and confidential. We never
                  share your data with third parties.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-8 rounded-2xl shadow-2xl max-w-md mx-auto text-center transform animate-bounce border border-green-500/50">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <svg
                className="w-12 h-12 text-white animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
            
            </h3>
            <p className="mb-4 text-lg">
              Your profile has been submitted successfully!
            </p>
            <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
            
              <p className="text-sm font-medium">
                 You'll hear from us soon!
              </p>
            </div>
            <p className="text-sm opacity-90">
              We'll review your application and get back to you within{" "}
              <strong>2-3 business days</strong>.
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={handleWhatsApp}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors"
              >
        
              </button>
              <button
                onClick={handleCall}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-black/80 py-8 px-4 sm:px-6 border-t border-gray-800">
        
      </div>
    </div>
  );
};

export default Contact;
