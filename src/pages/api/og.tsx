import { ImageResponse } from '@vercel/og';

export const config = {
    runtime: 'experimental-edge',
};

export default function () {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: "linear-gradient(45deg, rgba(158,64,212,1) 0%, rgba(18,17,45,1) 100%)",
                    fontSize: 32,
                    fontWeight: 600,
                }}
            >

                <svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>

                </svg>
                <div style={{ marginTop: 40, color: 'white' }}>To buy list</div>
            </div>

        ),
        {
            width: 1200,
            height: 600,
        },
    );
}