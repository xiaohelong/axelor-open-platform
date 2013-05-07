(function(){

var ui = angular.module('axelor.ui');

ui.formInput('CodeEditor', {

	css: "code-editor",

	link: function(scope, element, attrs, model) {
		
		var field = scope.getViewDef(element);
		var editor = ace.edit(element.get(0));
		var session = editor.getSession();
		var props = _.extend({
			syntax: 'text',
			theme : "textmate",
			fontSize: '14px',
			readonly: false,
			height: 280
		}, field);

		session.setMode("ace/mode/" + props.syntax);
		editor.setTheme('ace/theme/' + props.theme);
		editor.setFontSize(props.fontSize);
		editor.setShowPrintMargin(false);
		
		editor.setReadOnly(scope.isReadonly());
		
		var loadingText = false;
		model.$render = function() {
			loadingText = true;
			session.setValue(model.$viewValue || "");
			loadingText = false;
		};
		
		editor.on('change', function(e){
			if (loadingText)
				return;
			setTimeout(function(){
				scope.$apply(function(){
					model.$setViewValue(session.getValue());
				});
			});
		});
		scope.$watch('isReadonly()', function(value){
			editor.setReadOnly(value);
			editor.renderer.setShowGutter(!value);
			editor.setHighlightActiveLine(!value);
		});
		
		function resize() {
			editor.resize();
		}

		scope.$on("on:edit", resize);
		element.on('adjustSize', function(){
			if (element.is(':visible')) {
				element.height(props.height);
				element.width('auto');
				resize();
			}
		});

		element.resizable({
			handles: 's',
			resize: resize
		});
	},

	replace: true,

	transclude: true,
	
	template_editable: null,
	
	template_readonly: null,
	
	template: '<div style="min-height: 280px;" class="webkit-scrollbar-all" ng-transclude></div>'
});

})(this);