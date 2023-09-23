import SomeRandomService from '../service/SomeRandomService';

it('should calculate some value', () => {
    const functionToReturn2 = jest.spyOn(SomeRandomService.prototype, 'functionToReturn2');
    const someRandomService = new SomeRandomService();

    const result = someRandomService.calculate();

    expect(functionToReturn2).toHaveBeenCalledTimes(1);
    expect(result).toBe(4);
});
