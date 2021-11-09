/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./AnnotationParser","sap/base/assert","sap/base/Log","sap/base/util/extend","sap/base/util/isEmptyObject","sap/ui/base/EventProvider","sap/ui/thirdparty/jquery"],function(t,e,a,o,s,n,r){"use strict";var i=n.extend("sap.ui.model.odata.ODataAnnotations",{constructor:function(t){n.apply(this,arguments);if(arguments.length!==1){if(typeof arguments[2]==="object"){t=arguments[2]}t.urls=arguments[0];t.metadata=arguments[1]}this.oMetadata=t.metadata;this.oAnnotations=t.annotationData?t.annotationData:{};this.bLoaded=false;this.bAsync=t&&t.async;this.xPath=null;this.oError=null;this.bValidXML=true;this.oRequestHandles=[];this.oLoadEvent=null;this.oFailedEvent=null;this.mCustomHeaders=t.headers?o({},t.headers):{};if(t.urls){this.addUrl(t.urls);if(!this.bAsync){e(!s(this.oMetadata),"Metadata must be available for synchronous annotation loading");if(this.oError){a.error("OData annotations could not be loaded: "+this.oError.message)}}}},metadata:{publicMethods:["parse","getAnnotationsData","attachFailed","detachFailed","attachLoaded","detachLoaded"]}});i.prototype.getAnnotationsData=function(){return this.oAnnotations};i.prototype.isLoaded=function(){return this.bLoaded};i.prototype.isFailed=function(){return this.oError!==null};i.prototype.fireLoaded=function(t){this.fireEvent("loaded",t);return this};i.prototype.attachLoaded=function(t,e,a){this.attachEvent("loaded",t,e,a);return this};i.prototype.detachLoaded=function(t,e){this.detachEvent("loaded",t,e);return this};i.prototype.fireFailed=function(t){this.fireEvent("failed",t);return this};i.prototype.attachFailed=function(t,e,a){this.attachEvent("failed",t,e,a);return this};i.prototype.detachFailed=function(t,e){this.detachEvent("failed",t,e);return this};i.prototype.setHeaders=function(t){this.mCustomHeaders=o({},t)};i.prototype._createXMLDocument=function(t,e){var a=null;if(typeof t==="string"){e=t;t=null}if(t){a=t}else{a=(new DOMParser).parseFromString(e,"application/xml")}return a};i.prototype._documentHasErrors=function(t){return t.getElementsByTagName("parsererror").length>0};i.prototype._mergeAnnotationData=function(e,a){if(!this.oAnnotations){this.oAnnotations={}}t.merge(this.oAnnotations,e);this.bLoaded=true;if(!a){this.fireLoaded({annotations:e})}};i.prototype.setXML=function(e,a,n){var r={success:function(){},error:function(){},fireEvents:false};n=o({},r,n);var i=this._createXMLDocument(e,a);var u=function(e){var a={xmlDoc:e};var o=t.parse(this.oMetadata,e);if(o){a.annotations=o;n.success(a);this._mergeAnnotationData(o,!n.fireEvents)}else{n.error(a);if(n.fireEvents){this.fireFailed(a)}}}.bind(this,i);if(this._documentHasErrors(i)){n.error({xmlDoc:i});return false}else{var l=this.oMetadata.getServiceMetadata();if(!l||s(l)){this.oMetadata.attachLoaded(u)}else{u()}return true}};i.prototype.addUrl=function(t){var e=this;var a=t;if(Array.isArray(t)&&t.length==0){return Promise.resolve({annotations:this.oAnnotations})}if(!Array.isArray(t)){a=[t]}return new Promise(function(t,o){var s=0;var n={annotations:null,success:[],fail:[]};var r=function(r){s++;if(r.type==="success"){n.success.push(r)}else{n.fail.push(r)}if(s===a.length){n.annotations=e.oAnnotations;if(n.success.length>0){var i={annotations:e.oAnnotations,results:n};e.fireLoaded(i)}if(n.success.length<a.length){var u=new Error("At least one annotation failed to load/parse/merge");u.annotations=n.annotations;u.success=n.success;u.fail=n.fail;o(u)}else{t(n)}}};var i=0;if(e.bAsync){var u=Promise.resolve();for(i=0;i<a.length;++i){var l=e._loadFromUrl.bind(e,a[i]);u=u.then(l,l).then(r,r)}}else{for(i=0;i<a.length;++i){e._loadFromUrl(a[i]).then(r,r)}}})};i.prototype._loadFromUrl=function(t){var e=this;return new Promise(function(a,s){var n={url:t,async:e.bAsync,headers:o({},e.mCustomHeaders,{"Accept-Language":sap.ui.getCore().getConfiguration().getLanguageTag()})};var i;var u=function(a,o){if(i&&i.bSuppressErrorHandlerCall){return}e.oError={type:"fail",url:t,message:o,statusCode:a.status,statusText:a.statusText,responseText:a.responseText};if(e.bAsync){e.oFailedEvent=setTimeout(e.fireFailed.bind(e,e.oError),0)}else{e.fireFailed(e.oError)}s(e.oError)};var l=function(o,s,n){e.setXML(n.responseXML,n.responseText,{success:function(e){a({type:"success",url:t,message:s,statusCode:n.status,statusText:n.statusText,responseText:n.responseText})},error:function(t){u(n,"Malformed XML document")},url:t})};r.ajax(n).done(l).fail(u)})};i.prototype.destroy=function(){for(var t=0;t<this.oRequestHandles.length;++t){if(this.oRequestHandles[t]){this.oRequestHandles[t].bSuppressErrorHandlerCall=true;this.oRequestHandles[t].abort();this.oRequestHandles[t]=null}}n.prototype.destroy.apply(this,arguments);if(this.oLoadEvent){clearTimeout(this.oLoadEvent)}if(this.oFailedEvent){clearTimeout(this.oFailedEvent)}};return i});