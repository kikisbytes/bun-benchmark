const server = Bun.serve({
    port: 4000,
    fetch(request) {
        return new Response({});
    },
});
