$(function () {
   var activeTab = $('[href=' + location.hash + ']');
   activeTab && activeTab.tab('show');
   location.hash = '';
});
