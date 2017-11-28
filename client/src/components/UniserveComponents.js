import React from 'react';
import './css/uniserve.css';
import UniserveLogo from '../uniserve_logo.png';

export const UniserveHeader = () => {
    return (
        <header>
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ align: 'center', border: 0}}>
                <tbody><tr>
                <td className="bg-main" height="90" style={{ align: 'left', valign: 'middle'}}>
                <a href="http://www.uniserve.com"><img src={UniserveLogo} style={{height: 'auto', width: 'auto', marginRight: '100%' }}/></a>
                </td>
                <td></td>
                <td className="sign_button" style={{ align: 'right' }}>
                <div id="dialog"></div>
                <br />
                <a href="/?lang=en_CA">English</a>
                <a href="/?lang=fr_CA" style={{ marginLeft: 30}}>Français</a>
                </td>
                </tr>
                </tbody>
            </table>
        </header>
    );
};

export const UniserveMenu = () => {
  return (
    <ul id="menu_ul">
    <li><a href="/" className="">Devices</a>
    </li></ul>
  );
};

export const UniserveFooter = () => {
    return (
    <div>
    <div className="wrapper-boxed">

        <div className="clear-footer"></div>


          <div id="widget-area">
          <div className="container">

          <div className="footer-widget-wrapper">
        <aside id="nav_menu-3" className="widget widget_nav_menu"><h4 className="widget-title penci-border-arrow"><span className="inner-arrow">Legal</span></h4>
        <div className="menu-footer-menu-2-container"><ul id="menu-footer-menu-2" className="menu"><li id="menu-item-6030" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6030">Acceptable Use</li>
        <li id="menu-item-6029" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6029">911 Information</li>
        <li id="menu-item-6028" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6028">ITMP</li>
        <li id="menu-item-6027" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6027">Privacy Policy</li>
        <li id="menu-item-6026" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6026">Terms of Service</li>
        </ul></div></aside>
          </div>

          <div className="footer-widget-wrapper">
        <aside id="nav_menu-4" className="widget widget_nav_menu"><h4 className="widget-title penci-border-arrow"><span className="inner-arrow">Corporate</span></h4>
        <div className="menu-footer-menu-3-container"><ul id="menu-footer-menu-3" className="menu"><li id="menu-item-6039" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6039">Board of Directors</li>
        <li id="menu-item-6038" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6038">Investors</li>
        <li id="menu-item-7084" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7084">Press Coverage</li>
        <li id="menu-item-6040" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-6040">Regulatory Filings</li>
        </ul></div></aside>
          </div>

          <div className="footer-widget-wrapper last">
        <aside id="nav_menu-2" className="widget widget_nav_menu"><h4 className="widget-title penci-border-arrow"><span className="inner-arrow">Company</span></h4>
        <div className="menu-footer-menu-1-container"><ul id="menu-footer-menu-1" className="menu"><li id="menu-item-5986" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-5986">About Uniserve</li>
        <li id="menu-item-5985" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-5985">Careers</li>
        <li id="menu-item-7881" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7881">Refer a Friend</li>
        <li id="menu-item-6892" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-6892">Remote Assistance</li>
        <li id="menu-item-6150" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-6150">Contact</li>
        </ul></div></aside>
          </div>

            </div>
            </div>

        </div>
        <div id="footer-area">
        <footer id="footer-section">
          <div className="container">
                      <div className="footer-logo-copyright footer-not-logo footer-not-gotop">


                          <div id="footer-copyright">
                    <p>© 2017 Uniserve Communications | TSX: USS.V | All Rights Reserved</p>
                  </div>
                              </div>
              </div>
        </footer>

    </div>
    </div>
    );
};