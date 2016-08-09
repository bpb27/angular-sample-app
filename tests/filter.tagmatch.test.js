describe('tagMatch filter', function () {

    var tagMatch;

    beforeEach(module('myApp'));

    beforeEach(module(function ($provide) {
        DataService = new MockDataService({ tags: existingTags });
        $provide.value('DataService', DataService);
    }));

    beforeEach(inject(function ($filter) {
        tagMatch = $filter('tagMatch');
    }));

    it('Should not filter if there is no selected tag', function () {
        expect(tagMatch(songs, null)).toEqual(songs);
        expect(tagMatch(songs, '')).toEqual(songs);
    });

    it('Should filter based on selected tag', function () {
        var expectation = songs.slice(0, 1);
        expect(tagMatch(songs, 'punk')).toEqual(expectation);

        var secondExpectation = songs.slice(1, 3);
        expect(tagMatch(songs, 'metal')).toEqual(secondExpectation);

        var thirdExpectation = [];
        expect(tagMatch(songs, 'smooth jazz')).toEqual(thirdExpectation);
    });

    var existingTags = [
        { id: '1', name: 'punk' },
        { id: '2', name: 'metal' },
        { id: '3', name: 'smooth jazz' }
    ];

    var songs = [
        { title: 'Mack the Knife', tags: { '1': true } },
        { title: 'Billy the Spoon', tags: { '2': true } },
        { title: 'Timmy the Fork', tags: { '2': true } }
    ];

});
