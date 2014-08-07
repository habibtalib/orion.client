/*******************************************************************************
 * @license
 * Copyright (c) 2014 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/

/*eslint-env browser, amd*/
/*global URL*/
define(["orion/xhr","orion/encoding-shim", "orion/URL-shim"], function(xhr) {
	
	function GitFileImpl() {
	}

	GitFileImpl.prototype = {
		fetchChildren: function(location) {
			var fetchLocation = location;
			if (fetchLocation===this.fileBase) {
				return this.loadWorkspace(fetchLocation).then(function(jsondata) {return jsondata.Children || [];});
			}
			//If fetch location does not have ?depth=, then we need to add the depth parameter. Otherwise server will not return any children
			if (fetchLocation.indexOf("?depth=") === -1) { //$NON-NLS-0$
				fetchLocation += "?depth=1"; //$NON-NLS-0$
			}
			return xhr("GET", fetchLocation,{ //$NON-NLS-0$
				headers: {
					"Orion-Version": "1", //$NON-NLS-0$  //$NON-NLS-1$
					"Content-Type": "charset=UTF-8" //$NON-NLS-0$  //$NON-NLS-1$
				},
				timeout: 15000
			}).then(function(result) {
				var jsonData = result.response ? JSON.parse(result.response) : {};
				return jsonData.Children || [];
			});
		},
		loadWorkspaces: function() {
			return this.loadWorkspace(this._repoURL);
		},
		loadWorkspace: function(location) {
			var _this = this;
			var url = new URL(location);
			return this.fetchChildren(location).then(function(children) {
				var result = {
					Attributes: {
						Archive: false,
						Hidden: false,
						ReadOnly: true,
						SymLink: false
					},
					Location: location,
					Name: null,
					Length: 0,
					LocalTimeStamp: 0,
					Directory: true,
					ChildrenLocation: location,
					Children: children
				};
				result.Parents = [];
				result.Name = "/"; //$NON-NLS-0$ 
				return result;
			})
		},
		createProject: function(url, projectName, serverPath, create) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		createFolder: function(parentLocation, folderName) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		createFile: function(parentLocation, fileName) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		deleteFile: function(location) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		moveFile: function(sourceLocation, targetLocation, name) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		copyFile: function(sourceLocation, targetLocation, name) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		read: function(location, isMetadata) {
			var url = new URL(location, window.location);
			if (isMetadata) {
				url.query.set("parts", "meta"); //$NON-NLS-0$  //$NON-NLS-1$
			}
			return xhr("GET", url.href, {
				timeout: 15000,
				headers: { "Orion-Version": "1" }, //$NON-NLS-0$  //$NON-NLS-1$
				log: false
			}).then(function(result) {
				if (isMetadata) {
					return result.response ? JSON.parse(result.response) : null;
				} else {
					return result.response;
				}
			});
		},
		write: function(location, contents, args) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		remoteImport: function(targetLocation, options) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		remoteExport: function(sourceLocation, options) {
			throw "Not supported"; //$NON-NLS-0$ 
		},
		readBlob: function(location) {
			return xhr("GET", location, { //$NON-NLS-0$ 
				responseType: "arraybuffer", //$NON-NLS-0$ 
				timeout: 15000
			}).then(function(result) {
				return result.response;
			});
		},
		writeBlob: function(location, contents, args) {
			throw "Not supported"; //$NON-NLS-0$ 
		}
	};
	GitFileImpl.prototype.constructor = GitFileImpl;

	return GitFileImpl;
});