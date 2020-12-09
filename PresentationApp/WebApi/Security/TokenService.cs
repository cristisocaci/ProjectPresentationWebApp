using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WebApi.Security
{
    public class TokenService: ITokenService
    {
        private readonly IConfiguration configuration;

        public TokenService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("Security:SecretKey").Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
           
            var tokeOptions = new JwtSecurityToken(
                issuer: configuration.GetSection("Security:Issuer").Value,
                audience: configuration.GetSection("Security:Audience").Value,
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: signinCredentials
            );
            return new JwtSecurityTokenHandler().WriteToken(tokeOptions);
        }


    }
}
