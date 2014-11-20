/*******************************************************************************
 * @license
 * Copyright (c) 2014 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*eslint-env amd*/
define([
'javascript/fixes/fixUtils'
], function(FixUtils) {
    return function(editorContext, annotation) {
        return editorContext.getText().then(function(text) {
            var linestart = FixUtils.getLineStart(text, annotation.start);
            var fix = '//$FALLTHROUGH$';
            var indent = FixUtils.computeIndent(text, linestart);
            fix += FixUtils.computePostfix(text, annotation, indent);
            return editorContext.setText(fix, annotation.start, annotation.start);
        });
    };
});