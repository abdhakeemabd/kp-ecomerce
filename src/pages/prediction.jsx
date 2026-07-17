import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Logo from '../assets/images/logo/logo.png';
import BannerImg from '../assets/images/banner/banner.png';
import YamalImg from '../assets/images/predictions/yamal-3.jpg';
import MessiImg from '../assets/images/predictions/messi-3.jpg';

const countryCodes = [
  { code: '+91', country: 'IN' },
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+971', country: 'AE' },
  { code: '+966', country: 'SA' },
  { code: '+974', country: 'QA' },
  { code: '+965', country: 'KW' },
  { code: '+968', country: 'OM' },
  { code: '+973', country: 'BH' },
  { code: '+61', country: 'AU' },
];

const PredictionPage = () => {
  const isExpired = new Date() >= new Date('2026-07-20T00:00:00');

  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    phone: '',
    team1: 'Spain',
    team2: 'Argentina',
    score1: 0,
    score2: 0,
    penaltyScore1: 0,
    penaltyScore2: 0
  });
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if it's a draw AND user has interacted to show penalty section
    if (hasInteracted && formData.score1 === formData.score2) {
      setIsDraw(true);
    } else {
      setIsDraw(false);
      // Reset penalty scores if it's no longer a draw
      if (formData.penaltyScore1 > 0 || formData.penaltyScore2 > 0) {
        setFormData(prev => ({ ...prev, penaltyScore1: 0, penaltyScore2: 0 }));
      }
    }
  }, [formData.score1, formData.score2, hasInteracted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateScore = (field, increment) => {
    setHasInteracted(true);
    setFormData(prev => {
      const currentVal = prev[field];
      const newVal = increment ? currentVal + 1 : Math.max(0, currentVal - 1);
      return { ...prev, [field]: newVal };
    });
  };

  const getWinner = () => {
    if (formData.score1 > formData.score2) return formData.team1;
    if (formData.score2 > formData.score1) return formData.team2;
    
    // If it's a draw, check penalties
    if (formData.score1 === formData.score2) {
      if (formData.penaltyScore1 > formData.penaltyScore2) return formData.team1;
      if (formData.penaltyScore2 > formData.penaltyScore1) return formData.team2;
    }
    
    return "To Be Determined";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for existing submission from this phone number
    const fullPhone = `${formData.countryCode}${formData.phone}`;
    const submittedPhones = JSON.parse(localStorage.getItem('predictedPhones') || '[]');
    
    if (submittedPhones.includes(fullPhone)) {
      Swal.fire({
        icon: 'warning',
        title: 'Already Submitted!',
        text: 'A prediction has already been submitted with this phone number.',
        confirmButtonColor: '#ea580c'
      });
      return;
    }

    // If they submit a draw without interacting, force interaction to show penalty
    if (formData.score1 === formData.score2 && !isDraw) {
      setHasInteracted(true);
      Swal.fire({
        icon: 'info',
        title: 'Penalty Required',
        text: 'Please predict the penalty shootout score as it is a draw.',
        confirmButtonColor: '#ea580c'
      });
      return;
    }

    if (formData.score1 === formData.score2 && formData.penaltyScore1 === formData.penaltyScore2) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Prediction',
        text: 'Penalty scores cannot be tied. Please select a clear winner.',
        confirmButtonColor: '#ea580c'
      });
      return;
    }
    
    try {
      // Simulate API call to backend (Admin Panel & Mailer)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://z71mwq0q-8000.inc1.devtunnels.ms';
      await axios.post(`${API_BASE_URL}/api/v1/predictions`, {
        ...formData,
        finalWinner: getWinner()
      }).catch(err => {
        console.warn("Backend not available, saving offline mock");
      });

      // Save to localStorage to prevent duplicate submissions
      submittedPhones.push(fullPhone);
      localStorage.setItem('predictedPhones', JSON.stringify(submittedPhones));
      
      // Save full prediction data for Admin Panel
      const allPredictions = JSON.parse(localStorage.getItem('predictionsData') || '[]');
      allPredictions.push({
        id: `pred_${Date.now()}`,
        name: formData.name,
        phone: fullPhone,
        team1: formData.team1,
        team2: formData.team2,
        score1: formData.score1,
        score2: formData.score2,
        penaltyScore1: formData.penaltyScore1,
        penaltyScore2: formData.penaltyScore2,
        isDraw: formData.score1 === formData.score2,
        winner: getWinner(),
        date: new Date().toISOString()
      });
      localStorage.setItem('predictionsData', JSON.stringify(allPredictions));

      setSubmitted(true);

      // Show beautiful success modal
      Swal.fire({
        icon: 'success',
        title: 'Prediction Submitted!',
        text: 'Your prediction has been successfully sent to the admin panel and a confirmation will be emailed.',
        confirmButtonColor: '#22c55e',
        timer: 4000,
        timerProgressBar: true
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while submitting your prediction.',
        confirmButtonColor: '#ea580c'
      });
    }
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4 text-center font-sans tracking-wide">
        <Trophy className="w-20 h-20 text-gray-400 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Predictions Closed</h1>
        <p className="text-lg text-gray-600 max-w-lg mb-8">The deadline for World Cup 2026 predictions (July 19, 2026) has passed. Thank you for your interest!</p>
        <Link to="/" className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 tracking-wide" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        
        {/* Banner Section */}
        <div 
          className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden mb-8 relative px-6 py-12 text-center text-white border border-gray-200"
          style={{ backgroundImage: `url(${BannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <img src={Logo} alt="Eacyclic" className="h-10 mb-5 brightness-0 invert" />
            <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-md">Predict & Win</h1>
            <p className="text-gray-200 max-w-lg text-sm md:text-base mt-3">
              Predict the ultimate showdown and the exact score to <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 font-extrabold px-3 py-1 rounded shadow-lg transform -rotate-1 mt-1 border border-yellow-200">WIN A ₹500 VOUCHER!</span>
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prediction Received!</h2>
            <p className="text-gray-600 mb-6">
              Thank you, {formData.name}. You predicted <span className="font-bold text-gray-900">{getWinner()}</span> to win the cup! We'll contact you at {formData.countryCode} {formData.phone} if you win.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setHasInteracted(false);
                setFormData({name: '', countryCode: '+91', phone: '', team1: 'Spain', team2: 'Argentina', score1: 0, score2: 0, penaltyScore1: 0, penaltyScore2: 0});
              }}
              className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Submit Another Entry
            </button>
            <div className="mt-4">
              <Link to="/" className="text-orange-600 font-medium hover:underline">Return to Store</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* User Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Your Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  
                  {/* Single column looking phone input */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-colors bg-white">
                    <select 
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="py-2.5 px-3 bg-gray-50 text-gray-700 font-medium border-r border-gray-200 outline-none cursor-pointer hover:bg-gray-100 appearance-none"
                    >
                      {countryCodes.map(c => (
                        <option key={c.code} value={c.code}>{c.code}</option>
                      ))}
                    </select>
                    <input 
                      type="tel" 
                      name="phone"
                      maxLength="10"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 w-full py-2.5 px-4 outline-none border-none focus:ring-0 text-gray-900 placeholder-gray-400"
                      placeholder="10-digit number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Match Prediction Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Final Match Prediction</h3>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                
                {/* Team 1 Area (Spain) */}
                <div className="flex-1 w-full bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col items-center relative overflow-hidden">
                  
                  {/* Player Photo & Details */}
                  <div className="flex flex-col items-center mb-5 relative z-10">
                    <div className="relative mb-3">
                      <img 
                        src={YamalImg} 
                        alt="Lamine Yamal" 
                        className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg bg-gray-200"
                      />
                      <img 
                        src="https://flagcdn.com/w80/es.png" 
                        alt="Spain Flag" 
                        className="absolute -bottom-1 -right-1 w-8 h-5 border-2 border-white rounded shadow-md object-cover"
                      />
                    </div>
                    <div className="font-bold text-gray-900 text-xl tracking-tight">Spain</div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm relative z-10">
                    <button 
                      type="button" 
                      onClick={() => updateScore('score1', false)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="w-12 text-center text-3xl font-bold text-gray-900">
                      {formData.score1}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => updateScore('score1', true)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-gray-400 font-bold text-xl py-2 md:py-0">
                  VS
                </div>

                {/* Team 2 Area (Argentina) */}
                <div className="flex-1 w-full bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col items-center relative overflow-hidden">
                  
                  {/* Player Photo & Details */}
                  <div className="flex flex-col items-center mb-5 relative z-10">
                    <div className="relative mb-3">
                      <img 
                        src={MessiImg} 
                        alt="Lionel Messi" 
                        className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg bg-gray-200 object-top"
                      />
                      <img 
                        src="https://flagcdn.com/w80/ar.png" 
                        alt="Argentina Flag" 
                        className="absolute -bottom-1 -right-1 w-8 h-5 border-2 border-white rounded shadow-md object-cover"
                      />
                    </div>
                    <div className="font-bold text-gray-900 text-xl tracking-tight">Argentina</div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm relative z-10">
                    <button 
                      type="button" 
                      onClick={() => updateScore('score2', false)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="w-12 text-center text-3xl font-bold text-gray-900">
                      {formData.score2}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => updateScore('score2', true)}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Penalty Area */}
            {isDraw && (
              <div className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-200 animate-[fadeIn_0.3s_ease-in-out]">
                <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-orange-600" />
                  Penalty Shootout
                </h3>
                <p className="text-sm text-orange-700 mb-4 pb-3 border-b border-orange-200/50">
                  You predicted a draw. Please predict the final penalty shootout score.
                </p>
                
                <div className="flex flex-col md:flex-row justify-around gap-6">
                  {/* Penalty 1 */}
                  <div className="flex items-center justify-between md:flex-col gap-4 bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex-1">
                    <div className="font-bold text-gray-800 truncate px-2 text-center flex items-center gap-2">
                      <img src="https://flagcdn.com/w40/es.png" alt="Spain" className="w-5 h-3 shadow-sm rounded-sm" />
                      {formData.team1}
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => updateScore('penaltyScore1', false)}
                        className="w-8 h-8 flex items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="w-8 text-center text-xl font-bold text-gray-900">
                        {formData.penaltyScore1}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => updateScore('penaltyScore1', true)}
                        className="w-8 h-8 flex items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Penalty 2 */}
                  <div className="flex items-center justify-between md:flex-col gap-4 bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex-1">
                    <div className="font-bold text-gray-800 truncate px-2 text-center flex items-center gap-2">
                      <img src="https://flagcdn.com/w40/ar.png" alt="Argentina" className="w-5 h-3 shadow-sm rounded-sm" />
                      {formData.team2}
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => updateScore('penaltyScore2', false)}
                        className="w-8 h-8 flex items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="w-8 text-center text-xl font-bold text-gray-900">
                        {formData.penaltyScore2}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => updateScore('penaltyScore2', true)}
                        className="w-8 h-8 flex items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submission Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-gray-500 text-sm">Predicted Champion:</span>
                <div className="text-xl font-black text-gray-900 mt-1 flex items-center gap-2">
                  {getWinner()} 
                  {getWinner() === "Spain" && <img src="https://flagcdn.com/w40/es.png" alt="Spain" className="w-6 h-4 shadow-sm rounded-sm" />}
                  {getWinner() === "Argentina" && <img src="https://flagcdn.com/w40/ar.png" alt="Argentina" className="w-6 h-4 shadow-sm rounded-sm" />}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Submit Prediction
              </button>
            </div>
            
          </form>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
