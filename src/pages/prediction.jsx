import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle, Plus, Minus, ChevronRight, Menu, X, Gift, ClipboardList, User } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { ChevronDown, Shield, Zap, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { db, isFirebaseConfigured } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

import Logo from '../assets/images/logo/logo.png';
import BannerImg from '../assets/images/banner/banner.png';
import YamalHeroImg from '../assets/images/predictions/yamal-3.jpg';
import MessiHeroImg from '../assets/images/predictions/messi-3.jpg';
import YamalCardImg from '../assets/images/predictions/yamal-4.jpg';
import MessiCardImg from '../assets/images/predictions/messi-4.jpg';
import styles from './prediction.module.css';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.score1 === formData.score2) {
      setIsDraw(true);
    } else {
      setIsDraw(false);
      if (formData.penaltyScore1 > 0 || formData.penaltyScore2 > 0) {
        setFormData(prev => ({ ...prev, penaltyScore1: 0, penaltyScore2: 0 }));
      }
    }
  }, [formData.score1, formData.score2]);

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
    if (formData.score1 === formData.score2) {
      if (formData.penaltyScore1 > formData.penaltyScore2) return formData.team1;
      if (formData.penaltyScore2 > formData.penaltyScore1) return formData.team2;
    }
    return "To Be Determined";
  };
  const resetForm = () => {
    setFormData({
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
    setHasInteracted(false);
    setIsDraw(false);
    setIsSuccessModalOpen(false);
    setIsModalOpen(false);
  };

  const openSubmitModal = () => {
    if (formData.score1 === formData.score2 && formData.penaltyScore1 === formData.penaltyScore2 && isModalOpen) {
       // Handled in submit
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    if (formData.score1 === formData.score2 && formData.penaltyScore1 === formData.penaltyScore2) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Prediction',
        text: 'Penalty scores cannot be tied. Please select a clear winner.',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#ea580c'
      });
      return;
    }

    const fullPhone = `${formData.countryCode}${formData.phone}`;
    const submittedPhones = JSON.parse(localStorage.getItem('predictedPhones') || '[]');
    
    if (submittedPhones.includes(fullPhone)) {
      Swal.fire({
        icon: 'warning',
        title: 'Already Submitted!',
        text: 'A prediction has already been submitted with this phone number.',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#ea580c'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const predictionData = {
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
      };

      if (isFirebaseConfigured && db) {
        try {
          await addDoc(collection(db, "predictions"), predictionData);
          setIsModalOpen(false);
          setIsSuccessModalOpen(true);
        } catch (firebaseErr) {
          console.error("Firebase push failed", firebaseErr);
          Swal.fire('Error', 'Failed to save to Cloud Database.', 'error');
        }
      } else {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eacyclic-backend.onrender.com';
        try {
          await axios.post(`${API_BASE_URL}/api/v1/predictions/`, predictionData, {
            headers: {
              'X-Tunnel-Skip-AntiPhishing-Page': 'True'
            }
          });
          setIsModalOpen(false);
          setIsSuccessModalOpen(true);
        } catch (err) {
          console.error("Backend API error:", err);
          Swal.fire('Connection Error', 'Failed to connect to the backend server. Please ensure the server is online.', 'error');
        }
      }

    } catch (error) {
      console.error('Error submitting prediction:', error);
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center py-20 px-4 text-center font-sans">
        <Trophy className="w-20 h-20 text-orange-500 mb-6 opacity-50" />
        <h1 className="text-4xl font-bold text-white mb-4">Predictions Closed</h1>
        <p className="text-lg text-gray-400 max-w-lg mb-8">The deadline for predictions has passed. Thank you for your interest!</p>
        <Link to="/" className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full transition-colors">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-orange-500/30" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>


      {/* Hero Section */}
      <div className="relative w-full overflow-hidden min-h-[700px] flex flex-col items-center pt-32 pb-20">
        <div className="absolute inset-0 flex justify-between pointer-events-none overflow-hidden">
          {/* Argentina BG */}
          <div className="w-1/2 h-full relative opacity-50 md:opacity-70">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505] z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
            <img src={MessiHeroImg} className="w-full h-full object-cover object-[center_top] scale-110 origin-top" />
          </div>
          {/* Spain BG */}
          <div className="w-1/2 h-full relative opacity-50 md:opacity-70">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050505] z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
            <img src={YamalHeroImg} className="w-full h-full object-cover object-[center_top] scale-110 origin-top" />
          </div>
        </div>

        {/* Floating Sparks */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse pointer-events-none"></div>

        <div className="relative z-20 flex flex-col items-center text-center px-4 mt-8">
          <h2 className="text-orange-500 font-bold tracking-[0.3em] text-xs md:text-sm mb-3 uppercase">World Cup Final</h2>
          <h1 className="text-5xl md:text-8xl lg:text-[120px] font-black text-white italic tracking-tighter uppercase mb-2 leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
            Predict &<br/> <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">Win</span>
          </h1>
          <p className="text-gray-300 max-w-md text-sm md:text-base mt-4 mb-8 drop-shadow-lg">
            Predict the final score and win exciting prizes!<br/>
            <span className="text-white font-semibold">₹500 voucher up for grabs.</span>
          </p>
          <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_50px_rgba(234,88,12,0.6)] transition-all transform hover:-translate-y-1">
            Play Now
          </button>
          
          
        </div>
        
        {/* World Cup Trophy Mockup Placeholder */}
        <div className={`absolute bottom-[-100px] left-1/2 -translate-x-1/2 opacity-20 pointer-events-none ${styles.animateFloat}`}>
           <Trophy className="w-[400px] h-[400px] text-yellow-500" />
        </div>
      </div>

      {/* Prediction Section */}
      <div className="max-w-[1000px] mx-auto w-full px-4 relative z-30 -mt-24 mb-16">
        
        {/* Main Card Container */}
        <div className="bg-transparent relative p-2 md:p-6 pb-24">
          
          <h3 className="text-center text-orange-400 font-bold tracking-[0.2em] text-sm uppercase mb-8">Predict The Final Score</h3>
          
          <div className="flex flex-col md:flex-row items-stretch justify-center relative h-auto md:h-[340px] gap-6 md:gap-8">
            
            {/* VS Badge */}
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex w-16 h-14 bg-gradient-to-b from-[#2a1705] to-[#140a02] rounded-[16px] border border-orange-500/50 items-center justify-center text-orange-500 font-black text-xl shadow-[0_0_30px_rgba(249,115,22,0.4)]">
              VS
            </div>

            {/* Argentina (Left) */}
            <div className="flex-1 w-full relative h-[340px] hidden md:block">
              {/* Clipping wrapper for straight left edge */}
              <div className="absolute inset-0 -right-[120px] overflow-hidden rounded-l-[24px] z-10">
                {/* Skewed Card */}
                <div className="absolute top-0 bottom-0 -left-[100px] right-[120px] origin-bottom-left transform skew-x-12 bg-gradient-to-br from-[#121c2c] to-[#080d16] rounded-[24px] shadow-[0_0_30px_rgba(30,58,138,0.3)] overflow-hidden group">
                     {/* Unskew Content */}
                     <div className="absolute top-0 bottom-0 left-[100px] right-0 transform -skew-x-12 origin-bottom-left">
                       {/* Team Glow */}
                       <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
                       
                       {/* Top Left Flag */}
                       <div className="absolute top-5 left-5 z-20 bg-black/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 shadow-lg">
                         <img src="https://flagcdn.com/w80/ar.png" className="w-9 h-9 object-contain drop-shadow-md" alt="Argentina Flag" />
                       </div>

                       {/* Player Image */}
                       <div className="absolute top-0 left-[-10%] w-[120%] h-[80%] opacity-90 transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                         <div className="absolute inset-0 bg-gradient-to-t from-[#080d16] via-[#080d16]/30 to-transparent z-10" />
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080d16] z-10" />
                         <img src={MessiCardImg} className="w-full h-full object-cover object-top opacity-70" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />
                       </div>
                       
                       {/* Content at Bottom */}
                       <div className="absolute bottom-6 left-0 w-full flex flex-col items-center z-20 pr-12">
                         <h4 className="text-2xl font-bold text-white mb-0 drop-shadow-md">Argentina</h4>
                         <p className="text-gray-400 text-xs font-semibold mb-6 tracking-widest drop-shadow-md">ARG</p>
                         
                         {/* Score Input */}
                         <div className="flex items-center justify-between bg-[#151720]/90 backdrop-blur-md rounded-[20px] p-1.5 w-[220px] border border-white/5 shadow-2xl relative">
                           <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-[20px] pointer-events-none"></div>
                           <button type="button" onClick={() => updateScore('score2', false)} className="w-14 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                             <Minus className="w-5 h-5" strokeWidth={3} />
                           </button>
                           <span className="text-4xl font-medium text-white w-16 text-center tabular-nums leading-none">{formData.score2}</span>
                           <button type="button" onClick={() => updateScore('score2', true)} className="w-14 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                             <Plus className="w-5 h-5" strokeWidth={3} />
                           </button>
                         </div>
                       </div>
                     </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Fallback for Argentina */}
            <div className="w-full bg-gradient-to-br from-[#121c2c] to-[#080d16] rounded-3xl relative overflow-hidden group z-10 md:hidden h-[340px] shadow-[0_0_30px_rgba(30,58,138,0.3)] flex flex-col">
               {/* Team Glow */}
               <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>
               {/* Top Left Flag */}
               <div className="absolute top-5 left-5 z-20 bg-black/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 shadow-lg">
                 <img src="https://flagcdn.com/w80/ar.png" className="w-9 h-9 object-contain drop-shadow-md" alt="Argentina Flag" />
               </div>
               {/* Player Image */}
               <div className="absolute top-0 left-[-10%] w-[120%] h-[80%] opacity-90 transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                 <div className="absolute inset-0 bg-gradient-to-t from-[#080d16] via-[#080d16]/30 to-transparent z-10" />
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080d16] z-10" />
                 <img src={MessiCardImg} className="w-full h-full object-cover object-top opacity-70" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />
               </div>
               {/* Content at Bottom */}
               <div className="absolute bottom-6 left-0 w-full flex flex-col items-center z-20">
                 <h4 className="text-2xl font-bold text-white mb-0 drop-shadow-md">Argentina</h4>
                 <p className="text-gray-400 text-xs font-semibold mb-6 tracking-widest drop-shadow-md">ARG</p>
                 <div className="flex items-center justify-between bg-[#151720]/90 backdrop-blur-md rounded-[20px] p-1.5 w-[220px] border border-white/5 shadow-2xl relative">
                   <button type="button" onClick={() => updateScore('score2', false)} className="w-14 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                     <Minus className="w-5 h-5" strokeWidth={3} />
                   </button>
                   <span className="text-4xl font-medium text-white w-16 text-center tabular-nums leading-none">{formData.score2}</span>
                   <button type="button" onClick={() => updateScore('score2', true)} className="w-14 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                     <Plus className="w-5 h-5" strokeWidth={3} />
                   </button>
                 </div>
               </div>
            </div>

            <div className="md:hidden text-orange-500 font-black text-2xl text-center my-2">VS</div>

            {/* Spain (Right) */}
            <div className="flex-1 w-full relative h-[340px] hidden md:block z-0">
              {/* Clipping wrapper for straight right edge */}
              <div className="absolute inset-0 -left-[120px] overflow-hidden rounded-r-[24px]">
                {/* Skewed Card */}
                <div className="absolute top-0 bottom-0 -right-[100px] left-[120px] origin-bottom-right transform skew-x-12 bg-gradient-to-bl from-[#2c1212] to-[#160808] rounded-[24px] shadow-[0_0_30px_rgba(127,29,29,0.3)] overflow-hidden group">
                     {/* Unskew Content */}
                     <div className="absolute top-0 bottom-0 right-[100px] left-0 transform -skew-x-12 origin-bottom-right">
                       {/* Team Glow */}
                       <div className="absolute top-0 right-0 w-full h-full bg-red-500/10 blur-[80px] pointer-events-none"></div>
                       
                       {/* Top Right Flag */}
                       <div className="absolute top-5 right-5 z-20 bg-black/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 shadow-lg">
                         <img src="https://flagcdn.com/w80/es.png" className="w-9 h-9 object-contain drop-shadow-md" alt="Spain Flag" />
                       </div>

                       {/* Player Image */}
                       <div className="absolute top-0 right-[-10%] w-[120%] h-[80%] opacity-90 transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                         <div className="absolute inset-0 bg-gradient-to-t from-[#120404] via-[#120404]/30 to-transparent z-10" />
                         <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#120404] z-10" />
                         <img src={YamalCardImg} className="w-full h-full object-cover object-top opacity-70" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />
                       </div>
                       
                       {/* Content at Bottom */}
                       <div className="absolute bottom-6 left-0 w-full flex flex-col items-center z-20 pl-12">
                         <h4 className="text-2xl font-bold text-white mb-0 drop-shadow-md">Spain</h4>
                         <p className="text-gray-400 text-xs font-semibold mb-6 tracking-widest drop-shadow-md">ESP</p>
                         
                         {/* Score Input */}
                         <div className="flex items-center justify-between bg-[#1f1515]/90 backdrop-blur-md rounded-[20px] p-1.5 w-[220px] border border-white/5 shadow-2xl relative">
                           <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent rounded-[20px] pointer-events-none"></div>
                           <button type="button" onClick={() => updateScore('score1', false)} className="w-14 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                             <Minus className="w-5 h-5" strokeWidth={3} />
                           </button>
                           <span className="text-4xl font-medium text-white w-16 text-center tabular-nums leading-none">{formData.score1}</span>
                           <button type="button" onClick={() => updateScore('score1', true)} className="w-14 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                             <Plus className="w-5 h-5" strokeWidth={3} />
                           </button>
                         </div>
                       </div>
                     </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Fallback for Spain */}
            <div className="w-full bg-gradient-to-bl from-[#2c1212] to-[#160808] rounded-3xl relative overflow-hidden group z-0 md:hidden h-[340px] shadow-[0_0_30px_rgba(127,29,29,0.3)] flex flex-col">
               {/* Team Glow */}
               <div className="absolute top-0 right-0 w-full h-full bg-red-500/10 blur-[80px] pointer-events-none"></div>
               {/* Top Right Flag */}
               <div className="absolute top-5 right-5 z-20 bg-black/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 shadow-lg">
                 <img src="https://flagcdn.com/w80/es.png" className="w-9 h-9 object-contain drop-shadow-md" alt="Spain Flag" />
               </div>
               {/* Player Image */}
               <div className="absolute top-0 right-[-10%] w-[120%] h-[80%] opacity-90 transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                 <div className="absolute inset-0 bg-gradient-to-t from-[#120404] via-[#120404]/30 to-transparent z-10" />
                 <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#120404] z-10" />
                 <img src={YamalCardImg} className="w-full h-full object-cover object-top opacity-70" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />
               </div>
               {/* Content at Bottom */}
               <div className="absolute bottom-6 left-0 w-full flex flex-col items-center z-20">
                 <h4 className="text-2xl font-bold text-white mb-0 drop-shadow-md">Spain</h4>
                 <p className="text-gray-400 text-xs font-semibold mb-6 tracking-widest drop-shadow-md">ESP</p>
                 <div className="flex items-center justify-between bg-[#1f1515]/90 backdrop-blur-md rounded-[20px] p-1.5 w-[220px] border border-white/5 shadow-2xl relative">
                   <button type="button" onClick={() => updateScore('score1', false)} className="w-14 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                     <Minus className="w-5 h-5" strokeWidth={3} />
                   </button>
                   <span className="text-4xl font-medium text-white w-16 text-center tabular-nums leading-none">{formData.score1}</span>
                   <button type="button" onClick={() => updateScore('score1', true)} className="w-14 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                     <Plus className="w-5 h-5" strokeWidth={3} />
                   </button>
                 </div>
               </div>
            </div>

          </div>
          {/* Penalty section if draw */}
          {isDraw && (
            <div className="mt-8 animate-[fadeIn_0.3s_ease-out]">
              <h3 className="text-center text-orange-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-4">Penalty Predict</h3>
              <div className="flex flex-col md:flex-row items-stretch justify-center relative h-auto md:h-[180px] gap-4 md:gap-6">
                
                {/* VS Badge for penalty */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex w-10 h-8 bg-gradient-to-b from-[#2a1705] to-[#140a02] rounded-[10px] border border-orange-500/50 items-center justify-center text-orange-500 font-black text-[10px] shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  VS
                </div>

                {/* Argentina Penalty (Left) */}
                <div className="flex-1 w-full relative h-[180px] hidden md:block">
                  <div className="absolute inset-0 -right-[100px] overflow-hidden rounded-l-[16px] z-10">
                    <div className="absolute top-0 bottom-0 -left-[80px] right-[100px] origin-bottom-left transform skew-x-12 bg-gradient-to-br from-[#121c2c] to-[#080d16] rounded-[16px] shadow-[0_0_20px_rgba(30,58,138,0.3)] overflow-hidden group">
                         <div className="absolute top-0 bottom-0 left-[80px] right-0 transform -skew-x-12 origin-bottom-left">
                           <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-[40px] pointer-events-none"></div>
                           <div className="absolute top-3 left-3 z-20 bg-black/30 backdrop-blur-md rounded-lg p-1.5 border border-white/10 shadow-lg">
                             <img src="https://flagcdn.com/w80/ar.png" className="w-5 h-5 object-contain drop-shadow-md" alt="Argentina Flag" />
                           </div>
                           <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[140%] opacity-90 pointer-events-none">
                             <div className="absolute inset-0 bg-gradient-to-t from-[#080d16] via-[#080d16]/50 to-transparent z-10" />
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080d16] z-10" />
                             <img src={MessiCardImg} className="w-full h-full object-cover object-[center_top] opacity-40" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
                           </div>
                           <div className="absolute bottom-3 left-0 w-full flex flex-col items-center z-20 pr-6">
                             <div className="flex items-center justify-between bg-[#151720]/90 backdrop-blur-md rounded-[12px] p-1 w-[140px] border border-white/5 shadow-2xl relative">
                               <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-[12px] pointer-events-none"></div>
                               <button type="button" onClick={() => updateScore('penaltyScore2', false)} className="w-10 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                                 <Minus className="w-3 h-3" strokeWidth={3} />
                               </button>
                               <span className="text-2xl font-black text-white w-10 text-center tabular-nums leading-none">{formData.penaltyScore2}</span>
                               <button type="button" onClick={() => updateScore('penaltyScore2', true)} className="w-10 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                                 <Plus className="w-3 h-3" strokeWidth={3} />
                               </button>
                             </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>

                {/* Mobile Fallback Penalty Argentina */}
                <div className="w-full bg-gradient-to-br from-[#121c2c] to-[#080d16] rounded-2xl relative overflow-hidden z-10 md:hidden h-[180px] shadow-[0_0_20px_rgba(30,58,138,0.3)] flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-[40px] pointer-events-none"></div>
                  <div className="absolute top-3 left-3 z-20 bg-black/30 backdrop-blur-md rounded-lg p-1.5 border border-white/10 shadow-lg">
                    <img src="https://flagcdn.com/w80/ar.png" className="w-5 h-5 object-contain drop-shadow-md" alt="Argentina Flag" />
                  </div>
                  <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[140%] opacity-90 pointer-events-none">
                     <div className="absolute inset-0 bg-gradient-to-t from-[#080d16] via-[#080d16]/50 to-transparent z-10" />
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080d16] z-10" />
                     <img src={MessiCardImg} className="w-full h-full object-cover object-[center_top] opacity-40" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
                  </div>
                  <div className="absolute bottom-3 left-0 w-full flex flex-col items-center z-20">
                     <div className="flex items-center justify-between bg-[#151720]/90 backdrop-blur-md rounded-[12px] p-1 w-[140px] border border-white/5 shadow-2xl relative">
                       <button type="button" onClick={() => updateScore('penaltyScore2', false)} className="w-10 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                         <Minus className="w-3 h-3" strokeWidth={3} />
                       </button>
                       <span className="text-2xl font-black text-white w-10 text-center tabular-nums leading-none">{formData.penaltyScore2}</span>
                       <button type="button" onClick={() => updateScore('penaltyScore2', true)} className="w-10 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                         <Plus className="w-3 h-3" strokeWidth={3} />
                       </button>
                     </div>
                  </div>
                </div>

                <div className="md:hidden text-orange-500 font-black text-sm text-center my-1">VS</div>

                {/* Spain Penalty (Right) */}
                <div className="flex-1 w-full relative h-[180px] hidden md:block">
                  <div className="absolute inset-0 -left-[100px] overflow-hidden rounded-r-[16px] z-10">
                    <div className="absolute top-0 bottom-0 -right-[80px] left-[100px] origin-bottom-right transform skew-x-12 bg-gradient-to-bl from-[#2c1212] to-[#160808] rounded-[16px] shadow-[0_0_20px_rgba(127,29,29,0.3)] overflow-hidden group">
                         <div className="absolute top-0 bottom-0 right-[80px] left-0 transform -skew-x-12 origin-bottom-right">
                           <div className="absolute top-0 right-0 w-full h-full bg-red-500/10 blur-[40px] pointer-events-none"></div>
                           <div className="absolute top-3 right-3 z-20 bg-black/30 backdrop-blur-md rounded-lg p-1.5 border border-white/10 shadow-lg">
                             <img src="https://flagcdn.com/w80/es.png" className="w-5 h-5 object-contain drop-shadow-md" alt="Spain Flag" />
                           </div>
                           <div className="absolute top-[-20%] right-[-10%] w-[120%] h-[140%] opacity-90 pointer-events-none">
                             <div className="absolute inset-0 bg-gradient-to-t from-[#120404] via-[#120404]/50 to-transparent z-10" />
                             <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#120404] z-10" />
                             <img src={YamalCardImg} className="w-full h-full object-cover object-[center_top] opacity-40" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
                           </div>
                           <div className="absolute bottom-3 left-0 w-full flex flex-col items-center z-20 pl-6">
                             <div className="flex items-center justify-between bg-[#1f1515]/90 backdrop-blur-md rounded-[12px] p-1 w-[140px] border border-white/5 shadow-2xl relative">
                               <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent rounded-[12px] pointer-events-none"></div>
                               <button type="button" onClick={() => updateScore('penaltyScore1', false)} className="w-10 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                                 <Minus className="w-3 h-3" strokeWidth={3} />
                               </button>
                               <span className="text-2xl font-black text-white w-10 text-center tabular-nums leading-none">{formData.penaltyScore1}</span>
                               <button type="button" onClick={() => updateScore('penaltyScore1', true)} className="w-10 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                                 <Plus className="w-3 h-3" strokeWidth={3} />
                               </button>
                             </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>

                {/* Mobile Fallback Penalty Spain */}
                <div className="w-full bg-gradient-to-bl from-[#2c1212] to-[#160808] rounded-2xl relative overflow-hidden z-0 md:hidden h-[180px] shadow-[0_0_20px_rgba(127,29,29,0.3)] flex flex-col">
                  <div className="absolute top-0 right-0 w-full h-full bg-red-500/10 blur-[40px] pointer-events-none"></div>
                  <div className="absolute top-3 right-3 z-20 bg-black/30 backdrop-blur-md rounded-lg p-1.5 border border-white/10 shadow-lg">
                    <img src="https://flagcdn.com/w80/es.png" className="w-5 h-5 object-contain drop-shadow-md" alt="Spain Flag" />
                  </div>
                  <div className="absolute top-[-20%] right-[-10%] w-[120%] h-[140%] opacity-90 pointer-events-none">
                     <div className="absolute inset-0 bg-gradient-to-t from-[#120404] via-[#120404]/50 to-transparent z-10" />
                     <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#120404] z-10" />
                     <img src={YamalCardImg} className="w-full h-full object-cover object-[center_top] opacity-40" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
                  </div>
                  <div className="absolute bottom-3 left-0 w-full flex flex-col items-center z-20">
                     <div className="flex items-center justify-between bg-[#1f1515]/90 backdrop-blur-md rounded-[12px] p-1 w-[140px] border border-white/5 shadow-2xl relative">
                       <button type="button" onClick={() => updateScore('penaltyScore1', false)} className="w-10 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                         <Minus className="w-3 h-3" strokeWidth={3} />
                       </button>
                       <span className="text-2xl font-black text-white w-10 text-center tabular-nums leading-none">{formData.penaltyScore1}</span>
                       <button type="button" onClick={() => updateScore('penaltyScore1', true)} className="w-10 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                         <Plus className="w-3 h-3" strokeWidth={3} />
                       </button>
                     </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          <div className="w-full flex flex-col items-center mt-12 relative z-30">
            <button onClick={openSubmitModal} className="w-full max-w-[340px] bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold py-4 rounded-[16px] text-[15px] shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5">
              Submit Prediction
            </button>
            <p className="text-center text-gray-500 text-xs mt-3 font-medium tracking-wide">
              Result publish in <span className="text-orange-500 font-bold">20/07/2026 09:00 pm</span>.
            </p>
          </div>
          
        </div>
      </div>

      {/* Prizes Section */}
      <div id="rewards" className="max-w-4xl mx-auto w-full px-4 mb-24">
        <h3 className="text-center text-white font-bold tracking-wider mb-8 uppercase text-lg">Predict & Win Exciting Prizes!</h3>
        <div className="bg-gradient-to-r from-[#1a110a] to-[#0f0f11] border border-orange-900/40 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 relative overflow-hidden group hover:border-orange-500/40 transition-colors duration-500 shadow-2xl">
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-orange-500/30 transition-colors duration-500"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="relative">
              <div className="w-40 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-2xl border border-orange-300/30">
                 <div className="absolute inset-2 border border-white/20 border-dashed rounded-lg"></div>
                 <span className="text-white font-black text-3xl drop-shadow-md">₹500</span>
                 <span className="absolute -bottom-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded shadow-lg tracking-widest">VOUCHER</span>
              </div>
              <div className="absolute -top-6 -right-6 text-red-500 animate-bounce">
                <Gift className="w-10 h-10 drop-shadow-lg" fill="currentColor" />
              </div>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white mb-2">₹500 Voucher</h4>
              <p className="text-gray-400">for lucky winners</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-to-play" className="max-w-4xl mx-auto w-full px-4 mb-24">
        <h3 className="text-center text-white font-bold tracking-wider mb-8 uppercase text-lg">How It Works</h3>
        <div className="bg-[#0a0a0c] border border-white/5 rounded-3xl p-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-12 md:gap-0">
            {/* Line connecting */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-gray-700 to-transparent z-[-1]"></div>
            
            {[
              { icon: Trophy, step: 1, title: 'Predict', desc: 'Pick the final score' },
              { icon: ClipboardList, step: 2, title: 'Submit', desc: 'Submit your prediction' },
              { icon: Gift, step: 3, title: 'Win', desc: 'Get rewards if correct' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative group-hover:border-orange-500/50 transition-colors duration-300">
                  <item.icon className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -bottom-3 bg-[#050505] text-orange-500 font-bold text-sm w-7 h-7 flex items-center justify-center rounded-full border border-orange-500/50">
                    {item.step}
                  </div>
                </div>
                <h5 className="text-white font-bold text-lg mb-1">{item.title}</h5>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] transform scale-100 animate-[scaleUp_0.3s_ease-out]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors bg-[#1a1a1a] p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/30 text-orange-500">
                <Trophy className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white text-center mb-2">Complete Entry</h2>
            <p className="text-gray-400 text-sm text-center mb-8">Enter your details to submit your prediction and stand a chance to win.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#151515] border border-white/10 rounded-xl py-3.5 px-5 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-600"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="flex items-center bg-[#151515] border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
                  <select 
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="py-3.5 px-4 bg-[#1a1a1a] text-gray-300 font-bold border-r border-white/10 outline-none cursor-pointer hover:bg-[#222] appearance-none"
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
                    className="flex-1 w-full py-3.5 px-5 bg-transparent outline-none border-none focus:ring-0 text-white placeholder-gray-600"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
              


              <button type="submit" disabled={isSubmitting} className="w-full mt-8 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-orange-800 disabled:to-orange-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all transform hover:-translate-y-1">
                {isSubmitting ? 'Submitting...' : 'Confirm Entry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-sm p-8 text-center shadow-[0_0_50px_rgba(249,115,22,0.2)] transform scale-100 animate-[scaleUp_0.3s_ease-out]">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 text-green-500">
                <CheckCircle className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Submitted!</h2>
            <p className="text-gray-400 text-sm mb-8">Your prediction has been successfully received.</p>
            
            <div className="flex flex-col gap-3">
              <button onClick={resetForm} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-colors">
                Submit More
              </button>
              <Link to="/" onClick={() => setIsSuccessModalOpen(false)} className="w-full bg-[#151515] hover:bg-[#222] border border-white/10 text-white font-bold py-3.5 rounded-xl transition-colors">
                Visit Website
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
