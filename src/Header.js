import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar
} from "@progress/kendo-react-layout";

let edAvatar =
  "https://media-exp3.licdn.com/dms/image/C4D03AQGNHCbhjTLNRQ/profile-displayphoto-shrink_200_200/0/1516275449454?e=1629331200&v=beta&t=LVgmJ_zpsbZGYRsY6OeltWocprkzJK-CSzLQjJSl5cs";
const Header = (props) => {
  const { page } = props;
  return (
    <div className="appbar">
      <AppBar themeColor="inherit">
        <AppBarSection>
          {/* <button className="k-button k-button-clear"> */}
            {/* <span className="k-icon k-i-menu" /> */}
            <img src="https://chriscamicas.gallerycdn.vsassets.io/extensions/chriscamicas/openedge-abl/1.2.0/1587754986999/Microsoft.VisualStudio.Services.Icons.Default" style={{"max-width": "30px", "padding": "0px", "margin": "0px"}} />
          {/* </button> */}
        </AppBarSection>
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

        {/* "k-icon k-i-question" */}

        <AppBarSection >
          <Link to="/PowerBi">
            <Avatar shape="circle" type="image">
            <img src="https://i.imgur.com/RmRz9QL.jpg" style={{"max-width": "50px"}} />

          </Avatar>
          </Link>
        </AppBarSection>

        <span className="k-appbar-separator" />

        <AppBarSection>
          <Avatar shape="circle" type="image">
            <img src={edAvatar} />
          </Avatar>
        </AppBarSection>
      </AppBar>
    </div>
  );
};

export default Header;
