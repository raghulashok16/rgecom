import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { styles } from './AuthForm.styles';
import FormInput from '../../components/FormInput';
import { loginUser, registerUser } from '../../helper/authHelpers';
import { FloatingPaths } from '../../components/ui/background-paths';

const AuthForm = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (!signupSuccess) return;
    const t = setTimeout(() => setSignupSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [signupSuccess]);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const switchTab = (t) => {
    setTab(t);
    setErrors({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await loginUser({ username, password, setErrors, navigate });
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await registerUser({
      signupUsername, signupEmail, signupPassword, confirmPassword,
      setErrors, setSignupUsername, setSignupEmail, setSignupPassword, setConfirmPassword, switchTab,
      onSuccess: () => setSignupSuccess(true),
    });
    setIsLoading(false);
  };

  /* ── Light beam animation config ── */
  const beamTransition = (delay = 0) => ({
    duration: 2.5,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatDelay: 1,
    delay,
  });

  return (
    <div className={styles.page}>
      {/* Existing animated background */}
      <div className="absolute inset-0 text-slate-900">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* 3D perspective wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-sm px-4"
        style={{ perspective: 1500 }}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">

            {/* ── Animated card glow ── */}
            <motion.div
              className="absolute -inset-px rounded-2xl"
              animate={{
                boxShadow: [
                  '0 0 10px 2px rgba(0,0,0,0.04)',
                  '0 0 20px 6px rgba(0,0,0,0.08)',
                  '0 0 10px 2px rgba(0,0,0,0.04)',
                ],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            />

            {/* ── Traveling light beams ── */}
            <div className="absolute -inset-px rounded-2xl overflow-hidden pointer-events-none">
              {/* Top */}
              <motion.div
                className="absolute top-0 left-0 h-0.5 w-[45%] bg-linear-to-r from-transparent via-gray-400 to-transparent"
                animate={{ left: ['-50%', '110%'], opacity: [0.3, 0.7, 0.3] }}
                transition={{ left: beamTransition(0), opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror' } }}
                style={{ filter: 'blur(1.5px)' }}
              />
              {/* Right */}
              <motion.div
                className="absolute top-0 right-0 h-[45%] w-0.5 bg-linear-to-b from-transparent via-gray-400 to-transparent"
                animate={{ top: ['-50%', '110%'], opacity: [0.3, 0.7, 0.3] }}
                transition={{ top: beamTransition(0.6), opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 0.6 } }}
                style={{ filter: 'blur(1.5px)' }}
              />
              {/* Bottom */}
              <motion.div
                className="absolute bottom-0 right-0 h-0.5 w-[45%] bg-linear-to-r from-transparent via-gray-400 to-transparent"
                animate={{ right: ['-50%', '110%'], opacity: [0.3, 0.7, 0.3] }}
                transition={{ right: beamTransition(1.2), opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.2 } }}
                style={{ filter: 'blur(1.5px)' }}
              />
              {/* Left */}
              <motion.div
                className="absolute bottom-0 left-0 h-[45%] w-0.5 bg-linear-to-b from-transparent via-gray-400 to-transparent"
                animate={{ bottom: ['-50%', '110%'], opacity: [0.3, 0.7, 0.3] }}
                transition={{ bottom: beamTransition(1.8), opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.8 } }}
                style={{ filter: 'blur(1.5px)' }}
              />

              {/* Corner glows */}
              {[
                'top-0 left-0 w-[5px] h-[5px] bg-gray-400/40',
                'top-0 right-0 w-[7px] h-[7px] bg-gray-400/60',
                'bottom-0 right-0 w-[7px] h-[7px] bg-gray-400/60',
                'bottom-0 left-0 w-[5px] h-[5px] bg-gray-400/40',
              ].map((cls, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full blur-[1.5px] ${cls}`}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2 + i * 0.2, repeat: Infinity, repeatType: 'mirror', delay: i * 0.4 }}
                />
              ))}
            </div>

            {/* ── Glass card ── */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-xl overflow-hidden">

              {/* Subtle grid texture */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(135deg,#9ca3af 0.5px,transparent 0.5px),linear-gradient(45deg,#9ca3af 0.5px,transparent 0.5px)',
                  backgroundSize: '30px 30px',
                }}
              />

              {/* Logo + heading */}
              <div className="text-center space-y-1 mb-5">
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900"
                >
                  {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-400 text-xs"
                >
                  {tab === 'login' ? 'Sign in to continue to RgEcom' : 'Register to get started'}
                </motion.p>
              </div>

              {/* Tab switcher */}
              <div className={styles.tabWrapper}>
                <button type="button" onClick={() => switchTab('login')} className={tab === 'login' ? styles.tabActive : styles.tabInactive}>
                  Login
                </button>
                <button type="button" onClick={() => switchTab('signup')} className={tab === 'signup' ? styles.tabActive : styles.tabInactive}>
                  Signup
                </button>
              </div>

              {/* ── Login form ── */}
              <AnimatePresence mode="wait">
                {tab === 'login' ? (
                  <motion.form
                    key="login"
                    onSubmit={handleLogin}
                    noValidate
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-0"
                  >
                    <FormInput
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      error={errors.username}
                    />
                    <FormInput
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      error={errors.password}
                      wrapperClass={styles.fieldWrapperSm}
                    />

                    <div className={styles.forgotWrapper}>
                      <span className={styles.forgotLink}>Forgot password?</span>
                    </div>

                    {errors.server && <p className={styles.serverError}>{errors.server}</p>}

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={styles.submitBtn}
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        ) : (
                          <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                            Login <ArrowRight className="w-3 h-3" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <p className={styles.footerText}>
                      Don't have an account?{' '}
                      <span onClick={() => switchTab('signup')} className={styles.footerLink}>Register</span>
                    </p>
                  </motion.form>
                ) : (

                  /* ── Signup form ── */
                  <motion.form
                    key="signup"
                    onSubmit={handleSignup}
                    noValidate
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-0"
                  >
                    <FormInput
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="Username"
                      error={errors.signupUsername}
                    />
                    <FormInput
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="Email"
                      error={errors.signupEmail}
                    />
                    <FormInput
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Password"
                      error={errors.signupPassword}
                    />
                    <FormInput
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      error={errors.confirmPassword}
                      wrapperClass={styles.fieldWrapperLg}
                    />

                    {errors.server && <p className={styles.serverError}>{errors.server}</p>}

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={styles.submitBtn}
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        ) : (
                          <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                            Sign Up <ArrowRight className="w-3 h-3" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <p className={styles.footerText}>
                      Already have an account?{' '}
                      <span onClick={() => switchTab('login')} className={styles.footerLink}>Login</span>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* Success toast */}
      <AnimatePresence>
        {signupSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Account created successfully! Please log in.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
