import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";

const Header = (props) => {
  const { page } = props;
  return (
    <div className="appbar">
      <AppBar themeColor="inherit">
        <AppBarSection>
          <button className="k-button hamburger-button k-button-clear">
            <span className="k-icon k-i-menu" />
          </button>
        </AppBarSection>

        <AppBarSpacer
          style={{
            width: 1,
          }}
        />
        <AppBarSection>
          <Link to="/" className="header-link">
            <h1 className="title">WhatsUp Gold PoC</h1>
          </Link>
        </AppBarSection>

        <span className="k-appbar-separator" />

        <AppBarSection>
          <h1 className="title">{page}</h1>
        </AppBarSection>

        <AppBarSpacer />

        {/* <AppBarSection className="social-section">
          <button className="k-button k-button-clear">
            <span className="k-icon k-i-facebook" />
          </button>
          <button className="k-button k-button-clear">
            <span className="k-icon k-i-twitter" />
          </button>
          <button className="k-button k-button-clear">
            <span className="k-icon k-i-pinterest" />
          </button>
          <button className="k-button k-button-clear">
            <span className="k-icon k-i-google-plus" />
          </button>
        </AppBarSection> */}
      </AppBar>
    </div>
  );
};

export default Header;
