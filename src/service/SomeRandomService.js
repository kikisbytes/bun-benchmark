class SomeRandomService {
    functionToReturn2() {
        return 2;
    }

    calculate() {
        return 2 + this.functionToReturn2();
    }
}

export default SomeRandomService;
