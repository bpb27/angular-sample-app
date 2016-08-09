var app = angular.module('myApp');

app.filter('tagMatch', ['DataService', function (DataService) {
    return function (items, selectedTag) {
        if (!selectedTag)
            return items;
        return items.filter(function (item) {
            return DataService.getChildRefs('tags', item).filter(function (tag) {
                return tag.name === selectedTag;
            })[0];
        });
    };
}]);
