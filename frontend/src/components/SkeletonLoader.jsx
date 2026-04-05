import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
    if (type === 'card') {
        return (
            <div style={{ width: '100%', marginBottom: 40 }}>
                <div 
                    className="skeleton" 
                    style={{ 
                        aspectRatio: '4 / 5', 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: 20
                    }} 
                />
                <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 16, width: '40%' }} />
            </div>
        );
    }
    
    if (type === 'detail') {
        return (
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 100, padding: '120px 0' }}>
                <div className="skeleton" style={{ height: 700, width: '100%' }} />
                <div>
                    <div className="skeleton" style={{ height: 16, width: '30%', marginBottom: 20 }} />
                    <div className="skeleton" style={{ height: 60, width: '80%', marginBottom: 40 }} />
                    <div className="skeleton" style={{ height: 200, width: '100%', marginBottom: 60 }} />
                    <div className="skeleton" style={{ height: 64, width: '100%' }} />
                </div>
            </div>
        );
    }

    return <div className="skeleton" style={{ width: '100%', height: 100 }} />;
};

export default SkeletonLoader;
