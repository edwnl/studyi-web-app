import firebase from "firebase";
import React, {useContext, useState } from "react";
import { SidebarContext } from "../../utils/context/SidebarContext";
import { withRouter } from 'react-router-dom';
import {
  MenuIcon,
  OutlinePersonIcon,
  OutlineLogoutIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
} from "../../assets/icons";

import { Dropdown, DropdownItem, WindmillContext } from "@windmill/react-ui";
import {useAuth} from "../../utils/useAuthHook";
import {useHistory} from "react-router-dom";
import {Button} from "@chakra-ui/react";

function DashboardHeader() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const { user } = useAuth();
  const {history} = useHistory();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }

  function logoutHandler(event) {
    event.preventDefault();
    firebase.auth().signOut();
  }

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between lg:justify-end h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile Sidebar --> */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          <li className="relative">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === "dark" ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
          {/* <!-- Profile menu --> */}
          <li className="relative">
            <Button
                colorScheme={"studyi"}
              className="rounded-full focus:shadow-outline-purple focus:outline-none object-right relative justify-between"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <UserIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              <span>{user.displayName}</span>
            </Button>
            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => {
                setIsProfileMenuOpen(false)
              }}
            >
              <DropdownItem tag="a" href="/app/profile">
                <OutlinePersonIcon
                  className="w-4 h-4 mr-3"
                  aria-hidden="true"
                />
                <span>Profile</span>
              </DropdownItem>

              <DropdownItem tag="a" href="/" onClick={logoutHandler}>
                <OutlineLogoutIcon
                  className="w-4 h-4 mr-3"
                  aria-hidden="true"
                />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default DashboardHeader;
