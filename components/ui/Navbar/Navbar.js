import Link from 'next/link';
import s from './Navbar.module.css';

import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';
import router from 'next/router';

const Navbar = () => {
  const { user, signOut } = useUser();

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
            <nav className="space-x-2 ml-6 hidden lg:block">
             { user ? (
                <>
                  <Link href="/calculator">
                    <a className={s.link}>Calculator</a>
                  </Link>
                  <Link href="/account">
                    <a className={s.link}>Account</a>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/">
                    <a className={s.link}>Home</a>
                  </Link>
                  <Link href="/pricing">
                    <a className={s.link}>Pricing</a>
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {user ? (
              <Link href="#">
                <a className={s.link} onClick={() => {
                  router.replace("/signin");
                  signOut();
                }}>
                  Sign out
                </a>
              </Link>
            ) : (
              <Link href="/signin">
                <a className={s.link}>Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
