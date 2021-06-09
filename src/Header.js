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
    <>
      <AppBar themeColor="light">
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
          <Link to="/" style={{ textDecoration: "none" }}>
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
      <style>{`
        .title {
          font-size: 18px;
          margin: 0;
        }
        .hamburger-button { padding: 0; }
      `}</style>
    </>
  );
};

export default Header;
