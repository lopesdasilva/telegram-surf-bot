const { getEmoji } = require('../utils/utils');

function buildReport({ spot, ipmaReport }) {
  const {
    WebCamSreamerIos, Title, CondicaoSurf, CondicaoPraia,
  } = spot;
  const {
    WaterTemperature,
    WavePeriod,
    WaveDirection,
    WeatherCondition,
    UVCondition,
    TemperatureCondition,
    WindSpeedCondition,
    WindDirectionCondition,
    WaterTemperatureCondition,
    WaveHeightCondition,
    WavePeriodCondition,
    WaveDirectionCondition,
    BoxTitle,
    Weather,
    UV,
    Temperature,
    WindDirection,
    WindSpeed,
    WaveHeight,

  } = ipmaReport;

  return `*Surf & Praia report - ${Title}*
            
            *Surf condition:* ${CondicaoSurf}
            *Praia condition:* ${CondicaoPraia}
            *Weather condition:* ${Weather} ${getEmoji(WeatherCondition)}
            
            *🌊SEA*
            *Temperature:* ${WaterTemperature}ºC ${getEmoji(WaterTemperatureCondition)}
            *Wave height:* ${WaveHeight}m ${getEmoji(WaveHeightCondition)}
            *Wave period:* ${WavePeriod}s ${getEmoji(WavePeriodCondition)}
            *Wave direction:* ${WaveDirection} ${getEmoji(WaveDirectionCondition)}
            
            *🌬WIND*
            *Wind direction:* ${WindDirection} ${getEmoji(WindDirectionCondition)}
            *Wind speed:* ${WindSpeed}km/h  ${getEmoji(WindSpeedCondition)}
            *Wind temperature:* ${Temperature}ºC ${getEmoji(TemperatureCondition)}
                        
            *☀️UVCondition:* ${UV} ${getEmoji(UVCondition)} 
            
            ${BoxTitle}
            
            *🎥Stream:* ${WebCamSreamerIos}
            `;
}

exports.BeachReport = buildReport;
