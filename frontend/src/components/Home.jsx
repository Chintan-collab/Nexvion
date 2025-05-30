import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import {
  Star,
  X,
  Award,
  Briefcase,
  Languages,
  Code,
  Send,
  FileCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft  
} from 'lucide-react';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const consultantsData = location.state?.responseData;
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasonModal, setReasonModal] = useState({ open: false, content: '' });
  const [sentRequests, setSentRequests] = useState([]);
  
  useEffect(() => {
    const allConsultants = consultantsData.matched_consultants.flatMap(skillGroup =>
      skillGroup.ranked_candidates.map(candidate => ({
        name: candidate.metadata.name,
        isEmailSent: false
      }))
    );
    setSentRequests(allConsultants);
  }, []);
  
  const getRating = (consultant) => {
    if (consultant.metadata.seniority === 'Senior') return 5;
    if (consultant.metadata.seniority === 'Mid-Level') return 4;
    return 3;
  };

  const toggleCardExpansion = (consultantId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [consultantId]: !prev[consultantId],
    }));
  };

  const openModal = (consultant) => {
    setSelectedConsultant(consultant);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeReasonModal = () => setReasonModal({ open: false, content: '' });

  const sendRequest = (consultant) => {
    console.log(`Sending request to ${consultant.metadata.name}`);
  
    setSentRequests(prevRequests =>
      prevRequests.map(req =>
        req.name === consultant.metadata.name
          ? { ...req, isEmailSent: true }
          : req
      )
    );
  
    fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: "test@gmail.com", // make sure this exists
        subject: 'Consultation Request',
        text: `Hi ${consultant.metadata.name}, you have a new consultation request.`,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        alert(`Email sent to ${consultant.metadata.name} successfully!`);
      })
      .catch(error => {
        console.error('Email send error:', error);
        alert('Failed to send email.');
      });
  };
  
  

  const isEmailSent = (consultantName) => {
    return sentRequests.some((request) => request.name === consultantName && request.isEmailSent);
  };

  const handleDownloadResume = (consultant) => {
    alert(`Resume downloaded ${consultant.metadata.name} successfully!`);
  };

  const redirectToResult = () => {
    navigate("/result", { state: { data: {sentRequests} } });
  };

  const redirectToPrevious = () => {
    navigate("/projects");
  }

  const renderStars = (rating) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
        />
      ));
      const [query, setQuery] = useState("");

      const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
          console.log("User query submitted:", query);
          setQuery("");
        }
      };
  return (
    <div className="min-h-screen bg-black p-6">
        <button
      onClick={redirectToPrevious}
      className="
        group
        fixed
        left-8
        top-1/2
        -translate-y-1/2
        flex
        items-center
        gap-2
        px-3
        py-3
        rounded-full
        bg-gradient-to-r
        from-blue-600
        to-blue-400
        text-white
        font-semibold
        shadow-lg
        overflow-hidden
        transition-all
        duration-300
        ease-out
        hover:shadow-2xl
        hover:from-purple-600
        hover:to-pink-500
        focus:outline-none
        z-50
      "
    >
          <ArrowLeft
        className="
          w-5 h-5
          relative z-10
          transition-transform
          duration-300
          group-hover:translate-x-1.5
        "
      />
      <span className="relative z-10">Previous</span>
  
      {/* Animated background overlay */}
      <span
        className="
          absolute inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-300
          bg-gradient-to-r
          from-purple-600
          to-pink-500
          z-0
        "
        aria-hidden="true"
      />
    </button>
      <div className="max-w-6xl mx-auto overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-2">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              className="flex-grow px-4 py-3 rounded-3xl bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ask about consultants..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
        {consultantsData?.matched_consultants.map((skillGroup, groupIndex) => (
          <div key={groupIndex} className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-slate-700 rounded-lg px-4 py-2 inline-block">
                <h2 className="text-xl font-semibold text-white">{skillGroup.skill}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillGroup.ranked_candidates.map((consultant, idx) => {
                const consultantId = `${groupIndex}-${idx}`;
                const rating = getRating(consultant);
                const isExpanded = expandedCards[consultantId];
                const hasSentRequest = isEmailSent(consultant.metadata.name);

                return (
                  <div
                    key={consultantId}
                    className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200"
                  >
                    <div className="relative h-32 bg-gradient-to-r from-slate-400 to-white p-6">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                          {consultant.metadata.name}
                        </h3>
                        <div className="flex">{renderStars(rating)}</div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full">
                          {consultant.metadata.role}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-full">
                          {consultant.metadata.seniority}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center ">
                          <button
                        
                            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium"
                          >
                            <span className="mr-2">See why</span>
                         
                          </button>
                          <button
                            onClick={() =>
                              setReasonModal({ open: true, content: consultant.reason })
                            }
                            className="text-blue-500 hover:text-red-600 transition-colors"
                            title="View full reason"
                          >
                            <AlertCircle size={18} />
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 text-sm text-gray-700 bg-gray-100 p-4 rounded-lg">
                            {consultant.reason}
                          </div>
                        )}
                      </div>
                      {consultant.metadata.languages_spoken?.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-800 mb-1">Languages</h5>
                          <div className="flex flex-wrap gap-2">
                            {consultant.metadata.languages_spoken.map((language, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-gray-700 text-xs py-1 px-2 rounded-full"
                              >
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => openModal(consultant)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View Details
                        </button>

                        <button
                        onClick={() => sendRequest(consultant)}
                        className={`${
                          hasSentRequest ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                        } text-white py-2 px-4 rounded-lg flex items-center text-sm transition-colors`}
                      >
                        <Send size={16} className="mr-2" />
                        {hasSentRequest ? "Request Sent" : "Send Request"}
                      </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
      onClick={redirectToResult}
      className="
        group
        fixed
        right-8
        top-1/2
        -translate-y-1/2
        flex
        items-center
        gap-2
        px-4
        py-3
        rounded-full
        bg-gradient-to-r
        from-blue-600
        to-blue-400
        text-white
        font-semibold
        shadow-lg
        overflow-hidden
        transition-all
        duration-300
        ease-out
        hover:shadow-2xl
        hover:from-purple-600
        hover:to-pink-500
        focus:outline-none
        z-50
      "
    >
      <span className="relative z-10">Next</span>
      <ArrowRight
        className="
          w-5 h-5
          relative z-10
          transition-transform
          duration-300
          group-hover:translate-x-1.5
        "
      />
      {/* Animated background overlay */}
      <span
        className="
          absolute inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-300
          bg-gradient-to-r
          from-purple-600
          to-pink-500
          z-0
        "
        aria-hidden="true"
      />
    </button>
      {/* Consultant Modal */}
      {isModalOpen && selectedConsultant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedConsultant.metadata.name}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-blue-800">
                    {selectedConsultant.metadata.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h4 className="text-lg font-semibold text-gray-800 mr-3">
                      {selectedConsultant.metadata.name}
                    </h4>
                    <div className="flex">{renderStars(getRating(selectedConsultant))}</div>
                  </div>
                  <div className="flex items-center mb-1">
                    <Briefcase size={16} className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{selectedConsultant.metadata.role}</span>
                  </div>
                  <div className="flex items-center">
                    <Award size={16} className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{selectedConsultant.metadata.seniority}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-medium text-gray-800 mb-2">Description</h5>
                <p className="text-gray-700 text-sm">{selectedConsultant.metadata.description}</p>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                  <Languages size={16} className="mr-2" />
                  Languages
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedConsultant.metadata.languages_spoken?.map((language, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                  <Code size={16} className="mr-2" />
                  Technologies
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedConsultant.metadata.technologies?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 text-sm py-1 px-3 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                  <FileCheck size={16} className="mr-2" />
                  Certificates
                </h5>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {selectedConsultant.metadata.certificates?.map((cert, idx) => (
                    <li key={idx} className="mb-1">
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleDownloadResume(selectedConsultant);
                    closeModal();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center transition-colors"
                >
                  <Send size={16} className="mr-2" />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Match Reason Modal */}
      {reasonModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-lg">
            <div className="flex justify-end items-center px-4 py-3 border-b">
              <button
                onClick={closeReasonModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 text-sm text-gray-700">{reasonModal.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
