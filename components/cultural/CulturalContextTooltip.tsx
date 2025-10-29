/**
 * CULTURAL CONTEXT TOOLTIP
 * 
 * Interactive tooltip component for providing cultural context
 * Includes educational content, attribution, and sensitivity information
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React, { useState, useRef, useEffect } from 'react';
import { getCulturalElement, getCulturalContext, performSensitivityCheck } from '@/lib/cultural/RespectfulRepresentation';

export interface CulturalContextTooltipProps {
  elementId: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
  showSensitivity?: boolean;
  showAttribution?: boolean;
  showEducational?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CulturalContextTooltip: React.FC<CulturalContextTooltipProps> = ({
  elementId,
  children,
  position = 'top',
  delay = 500,
  maxWidth = 300,
  showSensitivity = true,
  showAttribution = true,
  showEducational = true,
  className = '',
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const culturalElement = getCulturalElement(elementId);
  const culturalContext = getCulturalContext(elementId);
  const sensitivityCheck = performSensitivityCheck(elementId);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const getTooltipPosition = (): React.CSSProperties => {
    if (!tooltipRef.current || !triggerRef.current) return {};

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const positions = {
      top: {
        bottom: window.innerHeight - rect.top + 10,
        left: rect.left + rect.width / 2 - tooltipRect.width / 2,
      },
      bottom: {
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2 - tooltipRect.width / 2,
      },
      left: {
        top: rect.top + rect.height / 2 - tooltipRect.height / 2,
        right: window.innerWidth - rect.left + 10,
      },
      right: {
        top: rect.top + rect.height / 2 - tooltipRect.height / 2,
        left: rect.right + 10,
      },
    };

    return positions[position];
  };

  if (!culturalElement || !culturalContext) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      className={`cultural-context-trigger ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="cultural-context-tooltip"
          style={{
            position: 'fixed',
            zIndex: 1000,
            maxWidth: `${maxWidth}px`,
            background: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.4',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            ...getTooltipPosition(),
          }}
        >
          {/* Title */}
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ff6b35' }}>
            {culturalElement.name}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '12px' }}>
            {culturalElement.description}
          </div>

          {/* Cultural Context */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#06ffa5' }}>
              Cultural Context:
            </div>
            <div>{culturalContext.context.historical}</div>
          </div>

          {/* Historical Significance */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#06ffa5' }}>
              Historical Significance:
            </div>
            <div>{culturalElement.historicalSignificance}</div>
          </div>

          {/* Attribution */}
          {showAttribution && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#06ffa5' }}>
                Attribution:
              </div>
              <div style={{ fontSize: '12px' }}>
                <div><strong>Artists:</strong> {culturalElement.attribution.artists.join(', ')}</div>
                <div><strong>Movements:</strong> {culturalElement.attribution.movements.join(', ')}</div>
                <div><strong>Communities:</strong> {culturalElement.attribution.communities.join(', ')}</div>
              </div>
            </div>
          )}

          {/* Sensitivity Information */}
          {showSensitivity && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#06ffa5' }}>
                Cultural Sensitivity:
              </div>
              <div style={{ fontSize: '12px' }}>
                <div><strong>Level:</strong> {culturalContext.sensitivity.level}</div>
                <div><strong>Score:</strong> {sensitivityCheck.score}/100</div>
                {culturalContext.sensitivity.warnings.length > 0 && (
                  <div style={{ color: '#ff6b35', marginTop: '4px' }}>
                    <strong>Warnings:</strong> {culturalContext.sensitivity.warnings.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Educational Content */}
          {showEducational && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#06ffa5' }}>
                Educational Content:
              </div>
              <div style={{ fontSize: '12px' }}>
                <div><strong>Cultural Significance:</strong> {culturalElement.educationalContent.culturalSignificance}</div>
                <div><strong>Contemporary Relevance:</strong> {culturalElement.educationalContent.contemporaryRelevance}</div>
              </div>
            </div>
          )}

          {/* Usage Guidelines */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#06ffa5' }}>
              Usage Guidelines:
            </div>
            <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '12px' }}>
              {culturalElement.usageGuidelines.map((guideline, index) => (
                <li key={index}>{guideline}</li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          {culturalElement.warnings.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#ff6b35' }}>
                Warnings:
              </div>
              <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '12px', color: '#ff6b35' }}>
                {culturalElement.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sensitivity Recommendations */}
          {sensitivityCheck.recommendations.length > 0 && (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#06ffa5' }}>
                Recommendations:
              </div>
              <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '12px' }}>
                {sensitivityCheck.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CulturalContextTooltip;

// Hook for using cultural context
export function useCulturalContext(elementId: string) {
  const culturalElement = getCulturalElement(elementId);
  const culturalContext = getCulturalContext(elementId);
  const sensitivityCheck = performSensitivityCheck(elementId);

  return {
    culturalElement,
    culturalContext,
    sensitivityCheck,
    hasContext: !!(culturalElement && culturalContext),
    isSensitive: culturalContext?.sensitivity.level === 'high' || culturalContext?.sensitivity.level === 'critical',
    needsWarning: culturalElement?.warnings.length > 0,
  };
}

// Higher-order component for adding cultural context
export function withCulturalContext<P extends object>(
  Component: React.ComponentType<P>,
  elementId: string,
  tooltipProps?: Partial<CulturalContextTooltipProps>
) {
  return function CulturalContextWrapper(props: P) {
    return (
      <CulturalContextTooltip elementId={elementId} {...tooltipProps}>
        <Component {...props} />
      </CulturalContextTooltip>
    );
  };
}

// Utility component for displaying cultural context information
export const CulturalContextInfo: React.FC<{ elementId: string }> = ({ elementId }) => {
  const { culturalElement, culturalContext, sensitivityCheck } = useCulturalContext(elementId);

  if (!culturalElement || !culturalContext) {
    return <div>Cultural context not found</div>;
  }

  return (
    <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.8)', color: 'white', borderRadius: '8px' }}>
      <h3 style={{ color: '#ff6b35', margin: '0 0 12px 0' }}>
        {culturalElement.name}
      </h3>
      
      <p style={{ margin: '0 0 12px 0' }}>
        {culturalElement.description}
      </p>
      
      <div style={{ marginBottom: '12px' }}>
        <strong style={{ color: '#06ffa5' }}>Cultural Context:</strong>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
          {culturalContext.context.historical}
        </p>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong style={{ color: '#06ffa5' }}>Historical Significance:</strong>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
          {culturalElement.historicalSignificance}
        </p>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong style={{ color: '#06ffa5' }}>Attribution:</strong>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
          Artists: {culturalElement.attribution.artists.join(', ')}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
          Movements: {culturalElement.attribution.movements.join(', ')}
        </p>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong style={{ color: '#06ffa5' }}>Cultural Sensitivity:</strong>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
          Level: {culturalContext.sensitivity.level} | Score: {sensitivityCheck.score}/100
        </p>
      </div>
      
      {culturalElement.warnings.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#ff6b35' }}>Warnings:</strong>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '14px' }}>
            {culturalElement.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <strong style={{ color: '#06ffa5' }}>Usage Guidelines:</strong>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '14px' }}>
          {culturalElement.usageGuidelines.map((guideline, index) => (
            <li key={index}>{guideline}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
