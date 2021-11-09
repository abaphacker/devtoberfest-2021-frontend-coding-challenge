/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BarInPageEnabler"],function(e){"use strict";var t={apiVersion:2};t.render=e.prototype.render;t.writeAccessibilityState=function(e,t){var i={role:t._getAccessibilityRole()};if(!t.getAriaLabelledBy().length){i.labelledby=t.getTitleId()}if(t.getActive()){i.haspopup=t.getAriaHasPopup()}if(t._sAriaRoleDescription){i.roledescription=t._sAriaRoleDescription}e.accessibilityState(t,i)};t.decorateRootElement=function(e,t){this.writeAccessibilityState(e,t);e.class("sapMTB");e.class("sapMTBNewFlex");if(t.getActive()){e.class("sapMTBActive");e.attr("tabindex","0")}else{e.class("sapMTBInactive")}e.class("sapMTB"+t.getStyle());e.class("sapMTB-"+t.getActiveDesign()+"-CTX");e.style("width",t.getWidth());e.style("height",t.getHeight())};t.renderBarContent=function(t,i){i.getContent().forEach(function(s){e.addChildClassTo(s,i);t.renderControl(s)})};t.shouldAddIBarContext=function(e){return false};return t},true);